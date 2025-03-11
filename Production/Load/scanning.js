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

// ✅ Function to Initialize Scanning Screen
function initializeScanningScreen() {
    updateDateAndShift();
    loadSelectedPlatform();

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
    window.location.href = "../index.html";
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

// ✅ Function to Auto Submit & Save to Google Sheets
function autoSubmit() {
    let C11 = document.getElementById("C11");
    let C12 = document.getElementById("C12");
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

    // ✅ Get the current timestamp and date
    let now = new Date();
    
    let estTimestamp = now.toLocaleString("en-US", { timeZone: "America/New_York" });
    let estDateOnly = now.toLocaleDateString("en-US", { timeZone: "America/New_York" });

    let scanText = `📦 Part: ${partNumber} | 🔢 Qty: ${quantity} | 🕒 ${estTimestamp}`;

    // ✅ Update Last Scan Info
    lastScanInfo.innerHTML = scanText;
    console.log(`✅ Last Recorded Scan: ${scanText}`);

    scanMessage.innerHTML = `✅ Scan Saved!`;
    scanMessage.className = "success";

    // ✅ Send Data to Google Sheets
    let data = {
        timestamp: estTimestamp,
        date: estDateOnly,
        partNumber: partNumber,
        quantity: quantity
    };

    console.log("🚀 Sending data:", data);

    fetch("https://script.google.com/macros/s/AKfycby0prpxOWmQKUGkmSnBTAAom-NiNkShOWbbKJdW6uhRbYYI6Yq7vD0xZHk27egYcIv3Eg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(() => console.log("✅ Scan saved to Google Sheets successfully!"))
    .catch(error => console.error("❌ Error:", error));

    // ✅ Clear Input Fields & Reset for Next Scan
    C11.value = "";
    C12.value = "";
    document.getElementById("D11").innerText = "";
    document.getElementById("D12").innerText = "";
    C12.disabled = true;

    setTimeout(() => {
        C11.focus();
    }, 100);
}