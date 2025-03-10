
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

// ✅ Handle Submit Button Click
document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-btn");
    if (submitButton) {
        submitButton.addEventListener("click", function () {
            saveCriticalPartsToStorage(); // ✅ Save data before navigating
            alert("✅ Parts submitted to production!");
            window.location.href = "../Production/Critical_Prod/Critical_Prod.html"; // ✅ Navigate to Production Screen
        });
    }
});

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

    localStorage.setItem("criticalPartsData", JSON.stringify(partsData));
    console.log("📂 Critical Parts Data Saved:", partsData);
}


