// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    updateDateAndShift();
    loadCounters(); 
    updateTotalDefects(); 
    attachButtonListeners();
    fetchAndUpdateCounters(); 
});

// ✅ Function to Attach Event Listeners to Buttons
function attachButtonListeners() {
    document.querySelectorAll(".inspection-button").forEach((button, index) => {
        button.removeEventListener("click", handleButtonClick);
        button.addEventListener("click", function () {
            handleButtonClick(button, index + 1);
        });
    });
}

// ✅ Function to Handle Button Click
function handleButtonClick(button, index) {
    let counter = document.getElementById(`counter${index}`);
    if (counter) {
        let count = parseInt(counter.innerText, 10) || 0;
        counter.innerText = count + 1;
        saveCounters();
        updateTotalDefects();
        sendDataToGoogleSheets(button); 
        sendDataToPivotSheet(button);
    }
}

// ✅ Function to Save Counters to LocalStorage
function saveCounters() {
    let counterValues = {};
    document.querySelectorAll(".counter").forEach((counter, index) => {
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
            if (counterElement) counterElement.innerText = savedCounters[key];
        });
    }
}

// ✅ Function to Reset Counters
function resetCounters() {
    document.querySelectorAll(".counter").forEach(counter => (counter.innerText = "0"));
    saveCounters();
    updateTotalDefects();
}

// ✅ Function to Open & Close Sidebar
function openSidebar() {
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block";
}
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none";
}

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    let now = new Date();
    let formattedDate = now.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

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

    let lastShift = localStorage.getItem("lastShift");
    if (lastShift !== shift) {
        console.log("🔄 Shift changed! Resetting counters...");
        resetCounters();
        localStorage.setItem("lastShift", shift);
    }
}

// ✅ Function to Calculate & Display Total Defects
function updateTotalDefects() {
    let total = 0;
    document.querySelectorAll(".counter").forEach(counter => {
        total += parseInt(counter.innerText, 10) || 0;
    });
    document.getElementById("totalDefects").innerHTML = `🔢 Total Defects: <b>${total}</b>`;
}

// ✅ Google Apps Script URLs
const DATA_SHEET_URL = "https://script.google.com/macros/s/AKfycbxAiBAzo6CTA_galZiUwCbzQLOvMTAcuJrknOkWXL2eH-_Px3XZi0Bd-mTH-e6y9tM1/exec";
const PIVOT_SHEET_URL = "https://script.google.com/macros/s/AKfycbx7YX25om-ff32eSxApJ8Yu8KDxwBugUbmJXYeg_gGPI6ZmHQfY28fBWq7NT2mangJW/exec";
const ESCALATION_DATA_URL = "https://script.google.com/macros/s/AKfycbyFWSzdNZGI1jdHoIn112_WnyEHt6rFbqAYFApBUDu9kPiSRqkMpA8Am0Om3o8iAaBxFA/exec";

// ✅ Function to Send Data to Google Sheets
function sendDataToGoogleSheets(buttonElement) {
    let shift = document.getElementById("currentShift").innerText.replace("🕒 Shift: ", "").trim();
    let mainDefect = buttonElement.innerText.split("\n")[0].trim().toUpperCase();
    let payload = JSON.stringify({ defect: mainDefect, shift: shift });

    fetch(DATA_SHEET_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: payload })
        .then(() => console.log(`✅ Sent to Data Sheet: ${mainDefect} | Shift: ${shift}`))
        .catch(error => console.error("❌ Error sending to Data Sheet:", error));

    fetch(PIVOT_SHEET_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: payload })
        .then(() => console.log(`✅ Sent to Pivot Sheet: ${mainDefect} | Shift: ${shift}`))
        .catch(error => console.error("❌ Error sending to Pivot Sheet:", error));
}

// ✅ Function to Fetch Escalation Data and Update Counters
async function fetchAndUpdateCounters() {
    try {
        const response = await fetch(ESCALATION_DATA_URL);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error fetching data:", data.error);
            return;
        }

        console.log("✅ Escalation Data Fetched:", data);

        // ✅ Normalize API keys: Remove quotes, convert to lowercase, and trim spaces
        let normalizedData = {};
        Object.keys(data).forEach(key => {
            let cleanKey = key.replace(/["']/g, "").trim().toLowerCase(); // Remove quotes and trim spaces
            normalizedData[cleanKey] = data[key];
        });

        console.log("🔍 Normalized Data Keys:", Object.keys(normalizedData));

        // ✅ Update each counter dynamically
        document.querySelectorAll(".inspection-button").forEach((button, index) => {
            let defectName = button.childNodes[0].nodeValue.trim().toLowerCase(); // ✅ Extract only the first text node (Main defect)

            if (normalizedData.hasOwnProperty(defectName)) {
                let defectCount = normalizedData[defectName]; // Retrieve the count

                // ✅ Update counter value
                let counterElement = document.getElementById(`counter${index + 1}`);
                if (counterElement) {
                    counterElement.innerText = defectCount;
                    console.log(`✅ Updated Counter for "${defectName}": ${defectCount}`);
                }
            } else {
                console.warn(`⚠️ No matching data found for: "${defectName}"`);
            }
        });

    } catch (error) {
        console.error("❌ Error fetching escalation data:", error);
    }
}

// ✅ Call this function on page load
document.addEventListener("DOMContentLoaded", fetchAndUpdateCounters);
