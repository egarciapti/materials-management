document.addEventListener("DOMContentLoaded", function () {
    initializeCriticalPartsScreen();
});


// ✅ Initialize the Critical Parts Screen
function initializeCriticalPartsScreen() {
    updateDateAndShift();
    attachInputListeners();
    loadNeededPallets();
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

// ✅ Load Needed Pallets from Firebase
function loadNeededPallets() {
    db.collection("criticalParts").onSnapshot((snapshot) => {
        let storedData = {};
        snapshot.forEach(doc => {
            storedData[doc.id] = doc.data().neededPallets;
        });

        document.querySelectorAll(".quantity-input").forEach(input => {
            let partNumber = input.dataset.partNumber;
            if (storedData.hasOwnProperty(partNumber)) {
                input.value = storedData[partNumber];
            }
        });

        console.log("🔄 Loaded Needed Pallets from Firebase:", storedData);
    });
}

// ✅ Save Updated Needed Pallets to Firebase
function saveNeededPallets(event) {
    let input = event.target;
    let partNumber = input.dataset.partNumber;
    let newQuantity = parseInt(input.value) || 0;

    db.collection("criticalParts").doc(partNumber).set({
        neededPallets: newQuantity
    }, { merge: true })
    .then(() => console.log(`✅ Updated Needed Pallets for ${partNumber}: ${newQuantity}`))
    .catch(error => console.error("❌ Error updating pallets:", error));
}

// ✅ Attach Event Listeners for Input Fields
function attachInputListeners() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", saveNeededPallets);
    });
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

            let url = "https://script.google.com/macros/s/AKfycbwBWcpHc8GILRYcIoF9czoyOUtGYtra4Ni1fmCIlDHJ_na1UEJtez4C4rDBAaZ0pICZ/exec"; // ✅ Your new Web App URL

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: partData }),
                mode: "no-cors"
            })
            .then(() => {
                console.log("✅ All values (including zeros) sent successfully!");
                alert("✅ Data sent successfully!");
            })
            .catch(error => {
                console.error("❌ Error sending data:", error);
                alert("❌ Failed to send data!");
            });
        });
    }
});
