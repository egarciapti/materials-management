document.addEventListener("DOMContentLoaded", function () {
    initializeCriticalPartsScreen();
});


// ✅ Define Functions BEFORE Calling initializeCriticalPartsScreen()
function loadNeededPallets() {
    let url = "https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbwBWcpHc8GILRYcIoF9czoyOUtGYtra4Ni1fmCIlDHJ_na1UEJtez4C4rDBAaZ0pICZ/exec"; // ✅ Replace with your actual Google Apps Script URL

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll(".quantity-input").forEach(input => {
                let partNumber = input.dataset.partNumber;
                if (data[partNumber] !== undefined) {
                    input.value = data[partNumber];
                }
            });
            console.log("✅ Loaded Needed Pallets:", data);
        })
        .catch(error => console.error("❌ Error loading data:", error));
}

// ✅ Define the Function BEFORE Calling It
function initializeCriticalPartsScreen() {
    updateDateAndShift();
    attachInputListeners();
    loadNeededPallets(); // ✅ This function is now defined before it's called
}

// ✅ Call initializeCriticalPartsScreen() AFTER All Function Definitions
document.addEventListener("DOMContentLoaded", function () {
    initializeCriticalPartsScreen();
});


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
            alert("✅ Parts submitted to production!");
            // 🔹 Add Firebase logic here if needed
        });
    }
});

// ✅ Attach Event Listeners for Input Fields
function attachInputListeners() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", function(event) {
            console.log(`🔄 Input changed for Part: ${event.target.dataset.partNumber}, New Value: ${event.target.value}`);
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-btn");

    if (submitButton) {
        submitButton.addEventListener("click", function () {
            let partData = [];

            // ✅ Loop through all quantity inputs
            document.querySelectorAll(".quantity-input").forEach(input => {
                let partNumber = input.dataset.partNumber;
                let quantity = input.value.trim();

                // ✅ Ensure every part number is sent with either its value or 0
                quantity = quantity === "" ? 0 : parseInt(quantity, 10);

                partData.push({ partNumber, quantity });
            });

            let url = "https://script.google.com/macros/s/AKfycbwBWcpHc8GILRYcIoF9czoyOUtGYtra4Ni1fmCIlDHJ_na1UEJtez4C4rDBAaZ0pICZ/exec"; // ✅ Correct URL

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ data: partData })
})
.then(response => response.json())
.then(data => {
    console.log("✅ Data sent successfully:", data);
    alert("✅ Data saved!");
})
.catch(error => {
    console.error("❌ Error sending data:", error);
    alert("❌ Failed to send data!");
});
        });
    }
});

