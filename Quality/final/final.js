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
    attachButtonListeners(); // ✅ Attach button event listeners
});

// ✅ Function to Attach Event Listeners to Buttons (Prevents Duplicate Event Attachments)
function attachButtonListeners() {
    const buttons = document.querySelectorAll(".inspection-button");

    buttons.forEach((button, index) => {
        button.removeEventListener("click", handleButtonClick); // Prevent duplicate listeners
        button.addEventListener("click", function () {
            handleButtonClick(button, index + 1);
        });
    });
}

// ✅ Function to Handle Button Click
function handleButtonClick(button, index) {
    const counter = document.getElementById(`counter${index}`);
    if (counter) {
        let count = parseInt(counter.innerText, 10) || 0;
        counter.innerText = count + 1;
        saveCounters();
        updateTotalDefects();
        sendDataToGoogleSheets(button); // ✅ Send to "Data" Tab
        sendDataToPivotSheet(button);  // ✅ Send to "Pivot" Tab
    }
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

// ✅ Function to Reset Counters
function resetCounters() {
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => counter.innerText = "0");

    saveCounters();
    updateTotalDefects();
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

// ✅ Function to Update Date & Shift and Reset Counters on Shift Change
function updateDateAndShift() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let shift = "Off Shift";

    if ((hours === 7 && minutes >= 0) || (hours >= 8 && hours < 15) || (hours === 15 && minutes <= 30)) {
        shift = "1st Shift";
    } else if ((hours === 15 && minutes >= 31) || (hours >= 16 && hours < 24)) {
        shift = "2nd Shift";
    }

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;

    // ✅ Check if shift has changed
    let lastShift = localStorage.getItem("lastShift");

    if (lastShift !== shift) {
        console.log("🔄 Shift changed! Resetting counters...");
        resetCounters(); // ✅ Reset counters on shift change
        localStorage.setItem("lastShift", shift); // ✅ Save new shift
    }
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

// ✅ Google Apps Script URLs
const DATA_SHEET_URL = "https://script.google.com/macros/s/AKfycbxAiBAzo6CTA_galZiUwCbzQLOvMTAcuJrknOkWXL2eH-_Px3XZi0Bd-mTH-e6y9tM1/exec";
const PIVOT_SHEET_URL = "https://script.google.com/macros/s/AKfycbx7YX25om-ff32eSxApJ8Yu8KDxwBugUbmJXYeg_gGPI6ZmHQfY28fBWq7NT2mangJW/exec";

// ✅ Function to Send Data to Google Sheets (Data & Pivot Tabs)
function sendDataToGoogleSheets(buttonElement) {
    const shift = document.getElementById("currentShift").innerText.replace("🕒 Shift: ", "").trim();
    
    // ✅ Extract only the first line of the button text
    const mainDefect = buttonElement.innerText.split("\n")[0].trim().toUpperCase();

    // ✅ Prepare Data Object
    const payload = JSON.stringify({ defect: mainDefect, shift: shift });

    // ✅ Send Data to "Data" Sheet
    fetch(DATA_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: payload
    }).then(() => console.log(`✅ Sent to Data Sheet: ${mainDefect} | Shift: ${shift}`))
      .catch(error => console.error("❌ Error sending to Data Sheet:", error));

    // ✅ Send Data to "Pivot" Sheet
    fetch(PIVOT_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: payload
    }).then(() => console.log(`✅ Sent to Pivot Sheet: ${mainDefect} | Shift: ${shift}`))
      .catch(error => console.error("❌ Error sending to Pivot Sheet:", error));
}
