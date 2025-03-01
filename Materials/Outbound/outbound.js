document.addEventListener("DOMContentLoaded", function () {
    initializeInboundScreen();
});

// ✅ Initialize Screen
function initializeInboundScreen() {
    document.getElementById("partNumber").focus(); // Auto-focus on first field
}

// ✅ Move Cursor Only When Enter is Pressed
document.getElementById("partNumber").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        document.getElementById("huNumber").focus();
    }
});

document.getElementById("huNumber").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        document.getElementById("serialNumber").focus();
    }
});

document.getElementById("serialNumber").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        document.getElementById("quantity").focus();
    }
});

// ✅ Auto-Submit when Quantity is Entered
document.getElementById("quantity").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        submitPalletInfo();
    }
});

// ✅ Submit Pallet Information and Reset Fields
function submitPalletInfo() {
    let partNumber = document.getElementById("partNumber").value.trim();
    let huNumber = document.getElementById("huNumber").value.trim();
    let serialNumber = document.getElementById("serialNumber").value.trim();
    let quantity = document.getElementById("quantity").value.trim();
    let timestamp = new Date().toLocaleString();

    if (partNumber && huNumber && serialNumber && quantity) {
        let table = document.getElementById("scannedPalletsTable").getElementsByTagName("tbody")[0];
        let newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${partNumber}</td>
            <td>${huNumber}</td>
            <td>${serialNumber}</td>
            <td>${quantity}</td>
            <td>${timestamp}</td>
        `;

        // ✅ Clear inputs and reset cursor for next scan
        document.getElementById("partNumber").value = "";
        document.getElementById("huNumber").value = "";
        document.getElementById("serialNumber").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("partNumber").focus();
    }
}

// ✅ Home Button Navigation
document.getElementById("backToMaterials").addEventListener("click", function () {
    window.location.href = "../materials.html"; // ✅ Navigate back to Materials screen
});
