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

// ✅ Sidebar Toggle Functions
function openSidebar() {
    console.log("📂 Opening Sidebar");
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; 
}

function closeSidebar() {
    console.log("📂 Closing Sidebar");
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; 
}

// ✅ Attach Event Listeners for Sidebar
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-btn").addEventListener("click", sendCriticalPartsToSheets);
});

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxa3dTulm69846WIMs_HrcwgAWNFQHbIDHCXpIqvEYz-U8hVxl6lu5ZxX5Y5qU9KmRo2A/exec"; // ✅ Your Deployment URL

function sendCriticalPartsToSheets() {
    let parts = [];
    let now = new Date();
    
    // ✅ Format Time and Date properly
    let formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
    let formattedDate = now.toLocaleDateString("en-US");

    document.querySelectorAll(".quantity-input").forEach(input => {
        let partNumber = input.dataset.partNumber;
        let quantity = parseInt(input.value) || 0;

        parts.push({ time: formattedTime, date: formattedDate, partNumber, quantity });
    });

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",  // ✅ Bypass CORS restrictions
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateQuantities", parts: parts })
    })
    .then(() => {
        console.log("✅ Critical Parts Quantities Updated in Google Sheets");
        alert("✅ Critical Parts Updated in Google Sheets!");
    })
    .catch(error => console.error("❌ Error:", error));
}

// ✅ Function to Save Data to localStorage
function saveCriticalPartsToStorage() {
    let partsData = {};
    document.querySelectorAll(".quantity-input").forEach(input => {
        let partNumber = input.dataset.partNumber;
        let quantity = input.value.trim();
        if (quantity !== "" && parseInt(quantity) > 0) {
            partsData[partNumber] = quantity; // ✅ Save only non-empty values
        }
    });

    let existingData = localStorage.getItem("criticalPartsData");
    if (existingData) {
        existingData = JSON.parse(existingData);
        partsData = { ...existingData, ...partsData }; // ✅ Merge new & old data
    }

    localStorage.setItem("criticalPartsData", JSON.stringify(partsData));
    console.log("📂 Critical Parts Data Updated:", partsData);
}
