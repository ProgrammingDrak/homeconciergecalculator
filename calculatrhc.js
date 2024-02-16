function onCommissionModelChange() {
    // Get the selected value from the <select> element
    const selectedCommissionModel = document.getElementById("commissionModel").value;
    const userInputPurchasePrice = document.getElementById("purchasePrice").value;
    const userInputStateCode = document.getElementById("stateCode").value;
    
    // Call the function with the selected value
    calculateRevenue(userInputPurchasePrice, selectedCommissionModel, userInputStateCode);
}

function calculateRevenue(purchasePrice, commissionModel, stateCode) {
    let estimatedRevenue;
    let cleverReferralFee; // Using variable for clarity
    let cleverCashBack; // Using variable for clarity
    const buyersAgentCommission = .025; // Based on 2.5% BAC - Able to edit quickly
    const listingAgentCommission = .03; // Standard listing fee
    const cleverListingAgentCommission = .015 // Clever's discounted listing fee
    purchasePrice = purchasePrice.replace(/,/g, ''); // Data validation
    purchasePrice = Number(purchasePrice); // Data validation

    switch (commissionModel) {
        case "Buyer Model (No CCB)": 
            cleverReferralFee = .3;
            estimatedRevenue = (purchasePrice * buyersAgentCommission) * cleverReferralFee; // No deductions in non-CCB state
            break;
        case "Clever Cashback (new $250)":
            cleverCashBack = 250;
            if (purchasePrice < 50,0000) {
                cleverCashBack = 0;
            }
            cleverReferralFee = .3;
            // Warning for incorrect CCB States
            if (stateCode != "CCB Eligible States") {
                alert("Not a CCB eligible state. Please double check if eligible to receive Cashback");
            }
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
            
            // Warning for incorrect CCB States
            if (stateCode != "CCB Eligible States") {
                alert("Not a CCB eligible state. Please double check if eligible to receive Cashback");
            }
            estimatedRevenue = ((purchasePrice * 0.03) * cleverReferralFee) - cleverCashBack;
            break;
        case "Mr. Cooper Buyer CCB":
        case "Mr. Cooper Seller CCB": 
            cleverReferralFee = .35; // 35% referral fee for all Mr. Cooper transactions
            // Sets the Clever Cash Back based upon the state code.
            if (stateCode === "Alaska" || stateCode === "Iowa" || stateCode === "Oklahoma" ) { // No Buyer CCB available for Buyer/Listing in these staets
                cleverCashBack = 0;
                console.log("Ineligible for CCB");
            } else if (stateCode === "Kansas" || stateCode === "Tennessee") { // Full commissions and Clever Cashback is awarded as a Gift Card
                cleverCashBack = getCooperCashback(purchasePrice);
                console.log("Clever Cashback is awarded via Gift Card. Full Commission charged");
            } else if (stateCode === "Oregon" || stateCode === "Mississippi") { // Only states where Seller/Buyer CCB differs
                if (commissionModel == "Mr. Cooper Buyer CCB") {
                    cleverCashBack = 0;
                    console.log("Ineligible for CCB");
                } else if (commissionModel === "Mr. Cooper Seller CCB") { // Listing model that needs a different algorithm because it is done by reduced listing commission
                    cleverCashBack = getCooperCashback(purchasePrice);
                    estimatedRevenue = ((purchasePrice * listingAgentCommission) - cleverCashBack) * cleverReferralFee;
                    console.log("Reduced Listing Commission CCB");
                    break;
                } else {
                alert("Error. Wrong Commission model");
                }
            }
            else { // All other states (including Missouri and Louisiana)
                cleverCashBack = getCooperCashback(purchasePrice);
            }

            estimatedRevenue = ((purchasePrice * listingAgentCommission) * cleverReferralFee) - cleverCashBack;
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
