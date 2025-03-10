// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    updateDateAndShift();

});




// ✅ Function to Open Sidebar
function openSidebar() {
    console.log("📂 Opening Sidebar"); 
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; 
}

// ✅ Function to Close Sidebar
function closeSidebar() {
    console.log("📂 Closing Sidebar"); 
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; 
}

document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    loadCriticalParts(); // ✅ Load initial values

    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    // ✅ Listen for updates from scanning.js
    window.addEventListener("criticalPartsUpdated", loadCriticalParts);
});

// ✅ Load Critical Parts Quantities
function loadCriticalParts() {
    let criticalParts = JSON.parse(localStorage.getItem("criticalPartsData")) || {};

    document.querySelectorAll(".quantity-input").forEach(input => {
        let partNumber = input.dataset.partNumber;
        if (criticalParts[partNumber] !== undefined) {
            input.value = criticalParts[partNumber]; // ✅ Set updated quantity
        }
    });
}

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


// ✅ Load and Save Data on Page Load
document.addEventListener("DOMContentLoaded", function () {
    loadCriticalPartsFromStorage(); // ✅ Load existing or submitted data
    setupInputListeners(); // ✅ Save changes when inputs are updated
});

// ✅ Function to Load Data from localStorage into Inputs
function loadCriticalPartsFromStorage() {
    let storedData = localStorage.getItem("criticalPartsData");
    if (storedData) {
        let partsData = JSON.parse(storedData);
        console.log("📂 Loading Critical Parts Data:", partsData);

        document.querySelectorAll(".quantity-input").forEach(input => {
            let partNumber = input.dataset.partNumber;
            if (partsData[partNumber]) {
                input.value = partsData[partNumber]; // ✅ Set stored value
            }
        });
    }
}

// ✅ Function to Save Input Changes to localStorage
function setupInputListeners() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", function () {
            saveCriticalPartsToStorage(); // ✅ Save data when changed
        });
    });
}

// ✅ Function to Store Data in localStorage
function saveCriticalPartsToStorage() {
    let partsData = {};
    document.querySelectorAll(".quantity-input").forEach(input => {
        let partNumber = input.dataset.partNumber;
        let quantity = input.value.trim();
        if (quantity !== "" && parseInt(quantity) > 0) {
            partsData[partNumber] = quantity; // ✅ Save only non-empty values
        }
    });

    localStorage.setItem("criticalPartsData", JSON.stringify(partsData));
    console.log("💾 Critical Parts Data Saved:", partsData);
}
