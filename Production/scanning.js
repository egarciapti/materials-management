// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    initializeScanningScreen();

    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
});

// ✅ Function to Open Sidebar
function openSidebar() {
    console.log("📂 Opening Sidebar"); // Debugging
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; // Show overlay
}

// ✅ Function to Close Sidebar
function closeSidebar() {
    console.log("📂 Closing Sidebar"); // Debugging
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; // Hide overlay
}

// ✅ Function to Initialize Scanning Screen
function initializeScanningScreen() {
    updateDateAndShift();
    loadSelectedPlatform();

    // Ensure back button works
    let backButton = document.getElementById("backToMain");
    if (backButton) {
        backButton.addEventListener("click", goBackToPlatformSelection);
    }
}

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString("en-US", options);

    let hours = now.getHours();
    let shift = (hours >= 7 && hours < 15) ? "1st Shift"
        : (hours >= 15 && hours < 23) ? "2nd Shift"
        : "Off Shift";

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;
}

// ✅ Function to Load Selected Platform
function loadSelectedPlatform() {
    let platform = localStorage.getItem("selectedPlatform") || "Unknown";
    document.getElementById("selectedPlatform").innerHTML = `🔹 Platform: <b>${platform}</b>`;
}

// ✅ Function to Handle Back Button Navigation
function goBackToPlatformSelection() {
    console.log("Navigating back to platform selection...");
    window.location.href = "../index.html"; // Ensure correct path
}

// ✅ Function to Handle Part Number Validation
function validateC11() {
    let C11 = document.getElementById("C11");
    let D11 = document.getElementById("D11");
    let barcode = C11.value.trim();
    let regexC11 = /^(?:\d{8}[A-Za-z]?|\d{8}-\d{2}|P\d{8}\.)$/;

    if (regexC11.test(barcode)) {
        D11.innerText = "✅ Successful Scanning";
        D11.className = "success";
        document.getElementById("C12").disabled = false;
        document.getElementById("C12").focus();
    } else {
        D11.innerText = "❌ Invalid Barcode, Try Again";
        D11.className = "error";
        C11.value = "";
        C11.focus();
        document.getElementById("C12").disabled = true;
    }
}

// ✅ Function to Handle Quantity Validation
function validateC12() {
    let C12 = document.getElementById("C12");
    let D12 = document.getElementById("D12");
    let quantity = C12.value.trim();

    if (quantity.includes(".")) {
        quantity = Math.floor(parseFloat(quantity)).toString();
    }

    let regexC12 = /^(?:\d{2}|Q\d)$/;

    if (regexC12.test(quantity)) {
        D12.innerText = "✅ Successful Entry";
        D12.className = "success";
        C12.value = quantity;
        autoSubmit();
    } else {
        D12.innerText = "❌ Invalid Quantity, Try Again";
        D12.className = "error";
        C12.value = "";
        C12.focus();
    }
}

function autoSubmit() {
    let C11 = document.getElementById("C11");  // Part Number Input
    let C12 = document.getElementById("C12");  // Quantity Input
    let scanMessage = document.getElementById("scanMessage");
    let lastScanInfo = document.getElementById("lastScanInfo");

    if (!C11 || !C12 || !scanMessage || !lastScanInfo) {
        console.error("❌ Missing required elements in autoSubmit(). Check HTML IDs.");
        return;
    }

    let partNumber = C11.value.trim();
    let quantity = C12.value.trim();

    if (!partNumber || !quantity) {
        console.warn("⚠️ Part Number or Quantity missing. Skipping entry.");
        return;
    }

    if (quantity.includes(".")) {
        quantity = Math.floor(parseFloat(quantity)).toString();
    }

    let timestamp = new Date().toLocaleString();
    let scanText = `📦 Part: ${partNumber} | 🔢 Qty: ${quantity} | 🕒 ${timestamp}`;

    // ✅ Replace the content with only the last scanned item
    lastScanInfo.innerHTML = scanText;

    console.log(`✅ Last Recorded Scan: ${scanText}`);

    scanMessage.innerHTML = `✅ Scan Saved!`;
    scanMessage.className = "success";

    // ✅ Send Scan Data to Google Sheets
    sendScanToGoogleSheets(partNumber, quantity);

    C11.value = "";
    C12.value = "";
    document.getElementById("D11").innerText = "";
    document.getElementById("D12").innerText = "";
    C12.disabled = true;
    C11.focus();
}



function sendScanToGoogleSheets(partNumber, quantity) {
    let platform = document.getElementById("selectedPlatform").innerText.replace("🔹 Platform: ", "").trim();
    let currentDate = document.getElementById("currentDate").innerText.replace("📅 Date: ", "").trim();
    let currentShift = document.getElementById("currentShift").innerText.replace("🕒 Shift: ", "").trim();
    let timestamp = new Date().toLocaleString();

    let scanData = {
        partNumber: partNumber,
        quantity: quantity,
        platform: platform,
        date: currentDate,
        shift: currentShift,
        timestamp: timestamp
    };

    let url = "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbwBWcpHc8GILRYcIoF9czoyOUtGYtra4Ni1fmCIlDHJ_na1UEJtez4C4rDBAaZ0pICZ/exec";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scanData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Scan data sent successfully:", data);
    })
    .catch(error => console.error("❌ Error sending scan data:", error));
}
