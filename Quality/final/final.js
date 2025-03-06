// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    updateDateAndShift();
    loadCounters(); // ✅ Load saved counters from LocalStorage
    updateTotalDefects(); // ✅ Update total defects on page load
    setupButtonClickEvents(); // ✅ Ensure buttons are only set up ONCE
});

// ✅ Function to Setup Button Click Events (Prevents Duplicate Listeners)
function setupButtonClickEvents() {
    const buttons = document.querySelectorAll(".inspection-button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            const counter = document.getElementById(`counter${index + 1}`);
            if (counter) {
                let count = parseInt(counter.innerText, 10) || 0;
                counter.innerText = count + 1; // ✅ Increase by 1
                saveCounters(); // ✅ Save updated counters to LocalStorage
                updateTotalDefects(); // ✅ Recalculate total
                sendDataToGoogleSheets(button); // ✅ Log defect to Google Sheets
            }
        });
    });
}

// ✅ Function to Save Counters to LocalStorage
function saveCounters() {
    let counterValues = {};
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter, index) => {
        counterValues[`counter${index + 1}`] = counter.innerText;
    });

    localStorage.setItem("finalInspectionCounters", JSON.stringify(counterValues));
}

// ✅ Function to Load Counters from LocalStorage
function loadCounters() {
    let savedCounters = localStorage.getItem("finalInspectionCounters");

    if (savedCounters) {
        savedCounters = JSON.parse(savedCounters);

        Object.keys(savedCounters).forEach(key => {
            let counterElement = document.getElementById(key);
            if (counterElement) {
                counterElement.innerText = savedCounters[key];
            }
        });
    }
}

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

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString("en-US", options);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let shift = "Off Shift"; // Default to Off Shift

    if ((hours === 7 && minutes >= 0) || (hours >= 8 && hours < 15) || (hours === 15 && minutes <= 30)) {
        shift = "1st Shift";
    } else if ((hours === 15 && minutes >= 31) || (hours >= 16 && hours < 24)) {
        shift = "2nd Shift";
    }

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;
}

// ✅ Function to Calculate and Display Total Defects
function updateTotalDefects() {
    let total = 0;
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        total += parseInt(counter.innerText, 10) || 0;
    });

    document.getElementById("totalDefects").innerHTML = `🔢 Total Defects: <b>${total}</b>`;
}

// ✅ Send Data to Google Sheets
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAiBAzo6CTA_galZiUwCbzQLOvMTAcuJrknOkWXL2eH-_Px3XZi0Bd-mTH-e6y9tM1/exec";

function sendDataToGoogleSheets(buttonElement) {
    const shift = document.getElementById("currentShift").innerText.replace("🕒 Shift: ", "").trim();
    const mainDefect = buttonElement.innerText.split("\n")[0].trim();

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defect: mainDefect, shift: shift })
    }).then(() => console.log(`✅ Sent: ${mainDefect} | Shift: ${shift}`))
      .catch(error => console.error("❌ Error:", error));
}
