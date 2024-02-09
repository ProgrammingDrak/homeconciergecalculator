function onCommissionModelChange() {
    // Get the selected value from the <select> element
    const selectedCommissionModel = document.getElementById("commissionModel").value;
    const userInputPurchasePrice = document.getElementById("purchasePrice").value;
    
    // Call the function with the selected value
    calculateRevenue(userInputPurchasePrice, selectedCommissionModel);
}

function calculateRevenue(purchasePrice, commissionModel) {
    let estimatedRevenue;
    let cleverReferralFee; // Using variable for clarity
    let cleverCashBack; // Using veraible for clarity
    const buyersAgentCommission = .025; // Based on 2.5% BAC - Able to edit quickly
    const listingAgentCommission = .03; // Standard listing fee
    const cleverListingAgentCommission = .015 // Clever's discounted listing fee
    purchasePrice = purchasePrice.replace(/,/g, ''); // Data validation
    purchasePrice = Number(purchasePrice); // Data validation

    switch (commissionModel) {
        case "Buyer Model (No CCB)": // *MOD* It would be best to validate this by passing the state through as well and verifying automatically
            cleverReferralFee = .3;
            estimatedRevenue = (purchasePrice * buyersAgentCommission) * cleverReferralFee; // No deductions in non-CCB state
            break;
        case "Clever Cashback (new $250)":
            cleverCashBack = 250;
            cleverReferralFee = .3;
            estimatedRevenue = ((purchasePrice * buyersAgentCommission) * cleverReferralFee) - cleverCashBack;
            break;
        case "Clever Cashback (0.5%)": // Used for our normal lender partners
        if (purchasePrice < 50000) {
            // If purchasePrice is below 50,000
            cleverCashBack = 0;
        } else if (purchasePrice >= 50000 && purchasePrice <= 150000) {
            // If purchasePrice is between 50,000 and 150,000 (inclusive)
            cleverCashBack = 250;
        } else {
            // If purchasePrice is greater than 150,000
            cleverCashBack = purchasePrice * .005;
        }    
        cleverReferralFee = .35;
            
            estimatedRevenue = ((purchasePrice * 0.03) * cleverReferralFee) - cleverCashBack;
            break;
        case "Mr Cooper Buyer CCB":
        case "Mr Cooper Seller CCB": // *MOD* Need to make another model for the reduced commission version
            cleverReferralFee = .35; // 35% referral fee for all Mr. Cooper transactions
            cleverCashBack = getCooperCashback(purchasePrice);
            estimatedRevenue = ((purchasePrice * listingAgentCommission) * cleverReferralFee) - cleverCashBack; // Subtract Mr. Cooper based cashback for buyer
            break;
        case "Traditional Model": // Properties under 100k have no guarantee of savings
            cleverReferralFee = .3
            estimatedRevenue = (purchasePrice * listingAgentCommission) * cleverReferralFee;
            break;
        case "1.5% Model":
            cleverReferralFee = .3;
            if (purchasePrice > 200000) {
                estimatedRevenue = (purchasePrice * cleverListingAgentCommission) * cleverReferralFee;
            } else {
                estimatedRevenue = 1000; // "Flat Fee Model" between $100,000 - $200,000
            }
            break;
        default:
            estimatedRevenue = 0; // Default to 0 if commission model is not recognized
    }

    // Get the HTML element of the revenue currently being displayed
    let estimatedRevenueFormatted = estimatedRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    var element = document.getElementById("cleverRevenueEstimate");
    element.innerHTML = estimatedRevenueFormatted;

    return estimatedRevenue; // We have the potential to be able to return "savings" and "cleverCashBack" here as well
}

const cooperCashBackData = [
    [0, 99999, 300],
    [100000, 149999, 650],
    [150000, 199999, 900],
    [200000, 249999, 1150],
    [250000, 299999, 1400],
    [300000, 349999, 1750],
    [350000, 399999, 2000],
    [400000, 449999, 2300],
    [450000, 499999, 2500],
    [500000, 599999, 3100],
    [600000, 699999, 3400],
    [700000, 799999, 4000],
    [800000, 899999, 4600],
    [900000, 999999, 5000],
    [1000000, 1999999, 6000],
    [2000000, 2999999, 7500],
    [3000000, 99999999999999, 8000]
];

// Function to find Mr. Cooper cashback value based on purchase price
function getCooperCashback(purchasePrice) {
    // Iterate through the cashbackData array
    for (let i = 0; i < cooperCashBackData.length; i++) {
        // Check if purchasePrice falls within the range of the current row
        if (purchasePrice >= cooperCashBackData[i][0] && purchasePrice <= cooperCashBackData[i][1]) {
            // If found, return the cashback value from the third column
            return cooperCashBackData[i][2];
        }
    }
    // If purchasePrice does not fall within any range, return null or an appropriate default value
    return 0;
}
