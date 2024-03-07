let agentCommissionPercentage = 0;
let cleverReferralPercentage = 0;
let cleverCashback = 0;
let partnerReferralAmount = 0;

const commissionModels = {
    buyer: {
        "Standard": { agentCommissionPercentage: 0.1, cleverReferralPercentage: 0.05, cleverCashback: 50, partnerReferralAmount: 20 },
        "Premium": { agentCommissionPercentage: 0.15, cleverReferralPercentage: 0.08, cleverCashback: 70, partnerReferralAmount: 30 }
    },
    seller: {
        "Basic": { agentCommissionPercentage: 0.08, cleverReferralPercentage: 0.03, cleverCashback: 40, partnerReferralAmount: 15 },
        "Advanced": { agentCommissionPercentage: 0.12, cleverReferralPercentage: 0.06, cleverCashback: 60, partnerReferralAmount: 25 }
    }
};

function onTransactionTypeChange() {
    const transactionType = document.getElementById("transactionType").value;
    const commissionModelSelect = document.getElementById("commissionModel");

    commissionModelSelect.innerHTML = "";

    for (const model in commissionModels[transactionType]) {
        const option = document.createElement("option");
        option.value = model;
        option.text = model;
        commissionModelSelect.add(option);
    }
}

function calculateRevenue() {
    const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);
    const transactionType = document.getElementById("transactionType").value;
    const selectedModel = document.getElementById("commissionModel").value;

    if (!isNaN(purchasePrice) && selectedModel in commissionModels[transactionType]) {
        const model = commissionModels[transactionType][selectedModel];
        agentCommissionPercentage = model.agentCommissionPercentage;
        cleverReferralPercentage = model.cleverReferralPercentage;
        cleverCashback = model.cleverCashback;
        partnerReferralAmount = model.partnerReferralAmount;

        const agentCommission = purchasePrice * agentCommissionPercentage;
        const cleverGrossRevenue = agentCommission * cleverReferralPercentage;
        const partnerReferral = partnerReferralAmount; // For simplicity, partnerReferral directly comes from the model
        const cleverFinalRevenue = cleverGrossRevenue - (cleverCashback + partnerReferral);

        // Update the output sections with calculated values
        document.getElementById("cleverGrossRevenueOutput").textContent = `Clever Gross Revenue: $${cleverGrossRevenue.toFixed(2)}`;
        document.getElementById("partnerReferralOutput").textContent = `Partner Referral: $${partnerReferral.toFixed(2)}`;
        document.getElementById("cleverCashbackOutput").textContent = `Clever Cashback: $${cleverCashback.toFixed(2)}`;
        document.getElementById("revenueResultOutput").textContent = `Revenue Result: $${cleverFinalRevenue.toFixed(2)}`;
    } else {
        alert("Invalid input. Please enter a valid numeric value for the purchase price and select a commission model.");
    }
}
