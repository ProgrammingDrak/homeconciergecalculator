function onTransactionTypeChange() {
    var transactionType = document.getElementById("transactionType").value;
    var commissionModelSelect = document.getElementById("commissionModel");
    commissionModelSelect.innerHTML = ""; // Clear the existing options

    if (transactionType === "buyer") {
        var buyerOptions = ["Buyer Model (No CCB)", 
        "Clever Cashback (new $250)", "Clever Cashback (0.5%)", 
        "Mr Cooper Buyer CCB"];
        for (var i = 0; i < buyerOptions.length; i++) {
            var option = document.createElement("option");
            option.text = buyerOptions[i];
            console.log(option.text);
            commissionModelSelect.add(option);
        }
    } else if (transactionType === "seller") {
        var sellerOptions = ["Flat Fee Model", "1% Model", "Traditional Model", "1.5% Model", "Mr Cooper Seller CCB"];
        for (var i = 0; i < sellerOptions.length; i++) {
            var option = document.createElement("option");
            option.text = sellerOptions[i];
            commissionModelSelect.add(option);
        }
    }
}