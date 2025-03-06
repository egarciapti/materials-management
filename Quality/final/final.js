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

    // ✅ Select all buttons inside the inspection grid (Only Once)
    const buttons = document.querySelectorAll(".inspection-button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // Find the corresponding counter (next sibling element)
            const counter = document.getElementById(`counter${index + 1}`);
            if (counter) {
                let count = parseInt(counter.innerText, 10) || 0; // Get current count
                count += 1; // ✅ Increase by 1
                counter.innerText = count; // ✅ Update UI
                saveCounters(); // ✅ Save updated counters to LocalStorage
                updateTotalDefects(); // ✅ Recalculate total after every click
            }
        });
    });
});

// ✅ Function to Save Counters to LocalStorage
function saveCounters() {
    let counterValues = {};
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter, index) => {
        counterValues[`counter${index + 1}`] = counter.innerText; // ✅ Store each counter value
    });

    localStorage.setItem("finalInspectionCounters", JSON.stringify(counterValues)); // ✅ Save as JSON
}

// ✅ Function to Load Counters from LocalStorage
function loadCounters() {
    let savedCounters = localStorage.getItem("finalInspectionCounters");

    if (savedCounters) {
        savedCounters = JSON.parse(savedCounters); // ✅ Convert back to object

        Object.keys(savedCounters).forEach(key => {
            let counterElement = document.getElementById(key);
            if (counterElement) {
                counterElement.innerText = savedCounters[key]; // ✅ Restore value
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
        total += parseInt(counter.innerText, 10) || 0; // ✅ Sum all counters
    });

    document.getElementById("totalDefects").innerHTML = `🔢 Total Defects: <b>${total}</b>`;
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAiBAzo6CTA_galZiUwCbzQLOvMTAcuJrknOkWXL2eH-_Px3XZi0Bd-mTH-e6y9tM1/exec";

document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    loadCounters(); // ✅ Load saved counters from LocalStorage
    updateTotalDefects(); // ✅ Update total defects on page load

    // ✅ Select all buttons inside the inspection grid (Only Once)
    const buttons = document.querySelectorAll(".inspection-button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // Find the corresponding counter (next sibling element)
            const counter = document.getElementById(`counter${index + 1}`);
            if (counter) {
                let count = parseInt(counter.innerText, 10) || 0; // Get current count
                count += 1; // ✅ Increase by 1
                counter.innerText = count; // ✅ Update UI
                saveCounters(); // ✅ Save updated counters to LocalStorage
                updateTotalDefects(); // ✅ Recalculate total after every click
                sendDataToGoogleSheets(button.innerText); // ✅ Send Data to Google Sheets
            }
        });
    });
});

// ✅ Function to Send Data to Google Sheets
function sendDataToGoogleSheets(defectName) {
    const shift = document.getElementById("currentShift").innerText.replace("🕒 Shift: ", "").trim();

    // ✅ Extract only the first line of the button text
    const mainDefect = defectName.split("\n")[0].trim();

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defect: mainDefect, shift: shift })
    }).then(() => console.log(`✅ Sent: ${mainDefect} | Shift: ${shift}`))
      .catch(error => console.error("❌ Error:", error));
}


