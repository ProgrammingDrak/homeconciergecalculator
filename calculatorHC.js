const buyersAgentCommission = .025; // Based on 2.5% BAC - Able to edit quickly
const listingAgentCommission = .03; // Standard listing fee
const cleverListingAgentCommission = .015 // Clever's discounted listing fee

// Variables that should be used throughout all the calculator functions
let estimatedRevenue;
let cleverReferralFee;
let cleverCashBack;

function calculateRevenue() {
    let purchasePrice = document.getElementById("purchasePrice").value;
        purchasePrice = purchasePrice.replace(/,/g, ''); // Data validation
        purchasePrice = Number(purchasePrice); // Data validation
    let stateCode = document.getElementById("stateCode").value;


    let estimatedRevenueFormatted;


    // var noCashbackBuyerModelData = noCashbackBuyerModel(purchasePrice);
    // Create a table variable for the table in the HTML file
    var table = document.getElementById("buyer-table");

        // Get the HTML element of the revenue currently being displayed
        /* Eventually I'd like to replace this with a for loop that goes through an array
         and just increments itself through the table correctly. It would likely take
         a good bit of work making the functions run at different times.*/
         /* All functions run and change the HTML after each one returns their values
          Runs the relevant calcuation function
          sends that through a formatting method
          pulls the id for the table from the HTML and the relevant cell
          uses the Key to get the appropriate value from the Object returned
          by the function. Best way to avoid multiple redundant variables.*/

         // Buyer table data completion
            // No Cashback buyer model Data Entry for the Table
        document.getElementById("buyer-table").rows[1].cells[1].innerHTML = 
            noCashbackBuyerModel(purchasePrice)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[2].cells[1].innerHTML = 
            noCashbackBuyerModel(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[3].cells[1].innerHTML = 
            noCashbackBuyerModel(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            // Normal Cashback buyer model  Data Entry for the Table  
        document.getElementById("buyer-table").rows[1].cells[2].innerHTML =
            cashbackBuyerModel(purchasePrice,stateCode)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[2].cells[2].innerHTML = 
            cashbackBuyerModel(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[3].cells[2].innerHTML = 
            cashbackBuyerModel(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            // Lender Partner Cashback Data Entry for the Table
        document.getElementById("buyer-table").rows[1].cells[3].innerHTML =
            lenderPartnerCashback(purchasePrice,stateCode)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[2].cells[3].innerHTML = 
            lenderPartnerCashback(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[3].cells[3].innerHTML = 
            lenderPartnerCashback(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            // Mr. Cooper Buyer Cashback Data Entry for the Table
        document.getElementById("buyer-table").rows[1].cells[4].innerHTML =
            mrCooperBuyerCashback(purchasePrice,stateCode)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[2].cells[4].innerHTML = 
            mrCooperBuyerCashback(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("buyer-table").rows[3].cells[4].innerHTML = 
            mrCooperBuyerCashback(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      // Seller Table Data Entry
            // 1.5% Commission Model
        document.getElementById("seller-table").rows[1].cells[1].innerHTML =
            cleverCoreModel(purchasePrice,stateCode)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("seller-table").rows[2].cells[1].innerHTML = 
            cleverCoreModel(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("seller-table").rows[3].cells[1].innerHTML = 
            cleverCoreModel(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });  
        document.getElementById("seller-table").rows[4].cells[1].innerHTML = 
            cleverCoreModel(purchasePrice,stateCode)["cleverAgentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });  
      // Mr. Cooper Seller Cashback Data Entry for the Table
        document.getElementById("seller-table").rows[1].cells[2].innerHTML =
            mrCooperSellerCashback(purchasePrice,stateCode)["estimatedRevenue"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("seller-table").rows[2].cells[2].innerHTML = 
            mrCooperSellerCashback(purchasePrice,stateCode)["cleverCashBack"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("seller-table").rows[3].cells[2].innerHTML = 
            mrCooperSellerCashback(purchasePrice,stateCode)["agentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });            
        document.getElementById("seller-table").rows[4].cells[2].innerHTML = 
            mrCooperSellerCashback(purchasePrice,stateCode)["cleverAgentCommissionAmount"].toLocaleString('en-US', { style: 'currency', currency: 'USD' });  
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

/* Here are all the calcuations for the calculator
 Could potentially put them in their own files if I install node.js to import
 Otherwise I'm going to have declare the constant variables
 at the beginning of EVERY function and import them through the
 HTML. No thank you on all fronts to that! */

// Function to calculate for states that don't do Cashback
function noCashbackBuyerModel (purchasePrice) {

    cleverCashBack = 0;
    cleverReferralFee = .3;
    estimatedRevenue = (purchasePrice * buyersAgentCommission) * cleverReferralFee; // No deductions in non-CCB state

    return {
        estimatedRevenue: estimatedRevenue,
        cleverCashBack: cleverCashBack,
        agentCommissionAmount: purchasePrice * buyersAgentCommission
        };
    
    }
function cashbackBuyerModel (purchasePrice, stateCode) {
    cleverCashBack = 250;
    cleverReferralFee = .3;

        // No cashback on purchases less than $50,000
        if (purchasePrice < 50000) {
            cleverCashBack = 0;
        }
        // Warning for incorrect CCB States
       if (stateCode != "CCB Eligible States") {
            cleverCashBack = 0;
        }
        estimatedRevenue = ((purchasePrice * buyersAgentCommission) * cleverReferralFee) - cleverCashBack;

        return {
            estimatedRevenue: estimatedRevenue,
            cleverCashBack: cleverCashBack,
            agentCommissionAmount: purchasePrice * buyersAgentCommission
        }
    }

    // Used for the majority of our lending partners
function lenderPartnerCashback (purchasePrice, stateCode) {
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
        cleverCashBack = 0;
    }
        estimatedRevenue = ((purchasePrice * buyersAgentCommission) * cleverReferralFee) - cleverCashBack;
      
        return {
            estimatedRevenue: estimatedRevenue,
            cleverCashBack: cleverCashBack,
            agentCommissionAmount: purchasePrice * buyersAgentCommission
        }
}

function mrCooperBuyerCashback (purchasePrice, stateCode) {
    cleverReferralFee = .35; // 35% referral fee for all Mr. Cooper transactions
    // Sets the Clever Cash Back based upon the state code.
    if (stateCode === "Alaska" || stateCode === "Iowa" || stateCode === "Oklahoma" || stateCode === "Oregon" || stateCode === "Mississippi") { // No Buyer CCB available for Buyer/Listing in these staets
        cleverCashBack = 0;
        console.log("Ineligible for CCB");
        // Full commissions and Clever Cashback is awarded as a Gift Card
    } else if (stateCode === "Kansas" || stateCode === "Tennessee") { // Full commissions and Clever Cashback is awarded as a Gift Card
        cleverCashBack = getCooperCashback(purchasePrice);
        console.log("Clever Cashback is awarded via Gift Card. Full Commission charged");
    }
    else { // All other states (including Missouri and Louisiana)
        cleverCashBack = getCooperCashback(purchasePrice);
    }

    estimatedRevenue = ((purchasePrice * buyersAgentCommission) * cleverReferralFee) - cleverCashBack;
    
    return {
        estimatedRevenue: estimatedRevenue,
        cleverCashBack: cleverCashBack,
        agentCommissionAmount: purchasePrice * buyersAgentCommission
    }
}

// Seller Calculator Functions
function cleverCoreModel (purchasePrice, stateCode) { 
    cleverReferralFee = .3;

        if (purchasePrice > 200000) {
            estimatedRevenue = (purchasePrice * cleverListingAgentCommission) * cleverReferralFee;
        } else if (purchasePrice > 100000 && purchasePrice <= 200000) {
            estimatedRevenue = 1000; // "Flat Fee Model" between $100,000 - $200,000
            return {
                estimatedRevenue: estimatedRevenue,
                // Keeping the key as "cleverCashBack to match the buyer code for ease."
                cleverCashBack: (purchasePrice * listingAgentCommission) - 3000, // Clever Agent commission defaults to flat fee of $3,000
                agentCommissionAmount: purchasePrice * listingAgentCommission,
                cleverAgentCommissionAmount: 3000 // Agent commission defaults to flat fee of $3,000
                }
        } else { // No guarantee of savings under 100,000
            estimatedRevenue = 1000;
            return {
                estimatedRevenue: estimatedRevenue,
                // Keeping the key as "cleverCashBack to match the buyer code for ease."
                cleverCashBack: 0,
                agentCommissionAmount: purchasePrice * listingAgentCommission,
                cleverAgentCommissionAmount: purchasePrice * listingAgentCommission
                }
            }

        return {
            estimatedRevenue: estimatedRevenue,
            // Keeping the key as "cleverCashBack to match the buyer code for ease."
            cleverCashBack: (purchasePrice * listingAgentCommission) - (purchasePrice * cleverListingAgentCommission),
            agentCommissionAmount: purchasePrice * listingAgentCommission,
            cleverAgentCommissionAmount: purchasePrice * cleverListingAgentCommission
            }

}

function mrCooperSellerCashback (purchasePrice, stateCode) {
    cleverReferralFee = .35; // 35% referral fee for all Mr. Cooper transactions
        // Sets the Clever Cash Back based upon the state code.
    if (stateCode === "Alaska" || stateCode === "Iowa" || stateCode === "Oklahoma" ) { // No Buyer CCB available for Buyer/Listing in these staets
        cleverCashBack = 0;
        console.log("Ineligible for CCB");
    } else if (stateCode === "Kansas" || stateCode === "Tennessee") { // Full commissions and Clever Cashback is awarded as a Gift Card
        cleverCashBack = getCooperCashback(purchasePrice);
        console.log("Clever Cashback is awarded via Gift Card. Full Commission charged");
        // Only states where Seller/Buyer CCB differs
    } else if (stateCode === "Oregon" || stateCode === "Mississippi") {
            cleverCashBack = getCooperCashback(purchasePrice);
            estimatedRevenue = ((purchasePrice * listingAgentCommission) - cleverCashBack) * cleverReferralFee;
            console.log("Reduced Listing Commission CCB");

            return {
                estimatedRevenue: estimatedRevenue,
                // Keeping the key as "cleverCashBack to match the buyer code for ease."
                cleverCashBack: 0,
                agentCommissionAmount: purchasePrice * listingAgentCommission,
                cleverAgentCommissionAmount: (purchasePrice * listingAgentCommission) - cleverCashBack
                }
    }
    else { // All other states (including Missouri and Louisiana)
        cleverCashBack = getCooperCashback(purchasePrice);
    }

    estimatedRevenue = ((purchasePrice * listingAgentCommission) * cleverReferralFee) - cleverCashBack;

    return {
        estimatedRevenue: estimatedRevenue,
        // Keeping the key as "cleverCashBack to match the buyer code for ease."
        cleverCashBack: cleverCashBack,
        agentCommissionAmount: purchasePrice * listingAgentCommission,
        cleverAgentCommissionAmount: purchasePrice * listingAgentCommission
        }
    }
