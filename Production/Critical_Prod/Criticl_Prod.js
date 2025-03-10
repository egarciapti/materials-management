// ✅ Google Apps Script Deployment URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxa3dTulm69846WIMs_HrcwgAWNFQHbIDHCXpIqvEYz-U8hVxl6lu5ZxX5Y5qU9KmRo2A/exec";

// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    updateDateAndShift();
    loadCriticalPartsFromGoogleSheets(); // ✅ Load initial values from Google Sheets

    // ✅ Listen for updates from scanning.js
    window.addEventListener("criticalPartsUpdated", loadCriticalPartsFromGoogleSheets);
});

// ✅ Function to Open Sidebar
function openSidebar() {
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; 
}

// ✅ Function to Close Sidebar
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; 
}

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    let hours = now.getHours();
    let shift = (hours >= 7 && hours < 15) ? "1st Shift"
        : (hours >= 15 && hours < 23) ? "2nd Shift"
        : "Off Shift";

    document.getElementById("currentDate").innerText = `📅 ${formattedDate}`;
    document.getElementById("currentShift").innerText = `🕒 ${shift}`;
}

// ✅ Function to Load Critical Parts from Google Sheets
function loadCriticalPartsFromGoogleSheets() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getCriticalParts`)
        .then(response => response.json())
        .then(data => {
            console.log("📥 Loaded Critical Parts:", data);
            document.querySelectorAll(".quantity-input").forEach(input => {
                let partNumber = input.dataset.partNumber;
                if (data[partNumber] !== undefined) {
                    input.value = data[partNumber]; // ✅ Set updated quantity
                }
            });
        })
        .catch(error => console.error("❌ Error loading critical parts:", error));
}

// ✅ Function to Save Updated Quantities to Google Sheets
function saveCriticalPartsToGoogleSheets() {
    let partsData = {};
    document.querySelectorAll(".quantity-input").forEach(input => {
        let partNumber = input.dataset.partNumber;
        let quantity = input.value.trim();
        if (quantity !== "") {
            partsData[partNumber] = quantity; // ✅ Save all values, even if 0
        }
    });

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",  // ✅ Avoid CORS issues
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "updateCriticalParts",
            data: partsData
        })
    })
    .then(() => console.log("✅ Critical Parts Data Saved to Google Sheets!"))
    .catch(error => console.error("❌ Error saving to Google Sheets:", error));
}

// ✅ Function to Decrease Quantity when a Pallet is Scanned in scanning.html
function updateCriticalPartsAfterScan(partNumber, scannedQuantity) {
    let input = document.querySelector(`.quantity-input[data-part-number="${partNumber}"]`);
    if (input) {
        let currentQuantity = parseInt(input.value) || 0;
        let newQuantity = Math.max(0, currentQuantity - scannedQuantity); // ✅ Ensure it doesn’t go below 0
        input.value = newQuantity;
        saveCriticalPartsToGoogleSheets(); // ✅ Save the new quantity to Google Sheets
    }
}

// ✅ Listen for Scans from scanning.js
window.addEventListener("partScanned", function (event) {
    let { partNumber, quantity } = event.detail;
    console.log(`🔄 Updating Critical Parts: ${partNumber} -${quantity}`);
    updateCriticalPartsAfterScan(partNumber, parseInt(quantity));
});

// ✅ Listen for Input Changes and Save Automatically
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", function () {
            saveCriticalPartsToGoogleSheets();
        });
    });
});
