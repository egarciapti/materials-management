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

// ✅ Google Apps Script Deployment URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxp0t7Ev05cRhr5g2MWrFAW6rQAs9ebdlX9jKfLSg31jCxZ3G_X6zOnG0pDSZnhyA86/exec";

// ✅ Function to Load Critical Parts Quantities from Google Sheets
function loadCriticalPartsFromGoogleSheets() {
    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            console.log("📥 Loaded Critical Parts:", data);
            document.querySelectorAll(".quantity-input").forEach(input => {
                let partNumber = input.dataset.partNumber;
                if (data[partNumber] !== undefined) {
                    input.value = data[partNumber]; // ✅ Set actual quantity
                } else {
                    input.value = 0; // ✅ Default value if part number not found
                }
            });
        })
        .catch(error => console.error("❌ Error loading critical parts:", error));
}

// ✅ Load Data on Page Load
document.addEventListener("DOMContentLoaded", function () {
    loadCriticalPartsFromGoogleSheets();
});

