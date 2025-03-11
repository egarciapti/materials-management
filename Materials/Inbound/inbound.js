document.addEventListener("DOMContentLoaded", function () {
    initializeInboundScreen();

    // ✅ Ensure the button exists before adding an event listener
    let newTruckButton = document.getElementById("newTruckButton");
    if (newTruckButton) {
        newTruckButton.addEventListener("click", function () {
            let confirmation = confirm("⚠️ Warning: This will reset all scanned pallets and counters. Do you want to continue?");
            if (confirmation) {
                resetInboundProcess();
            }
        });
    }
});


// ✅ Function to Reset the Scanning Process
function resetInboundProcess() {
    let tableBody = document.getElementById("scannedPalletsTable").querySelector("tbody");
    
    // ✅ Clear all scanned rows
    tableBody.innerHTML = "";

    // ✅ Reset counters
    document.getElementById("palletCount").innerText = "0";
    document.getElementById("totalParts").innerText = "0";

    // ✅ Reset input fields
    document.getElementById("partNumber").value = "";
    document.getElementById("huNumber").value = "";
    document.getElementById("serialNumber").value = "";
    document.getElementById("quantity").value = "";

    // ✅ Reset row numbering logic
    updateRowNumbers();

    // ✅ Set focus back to part number field for new batch
    document.getElementById("partNumber").focus();
}

// ✅ Ensure Row Numbers Start from 1 After Reset
function updateRowNumbers() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1; // Update row numbers to start from 1
    }
}


// ✅ Initialize Screen and Attach Listeners
function initializeInboundScreen() {
    document.getElementById("partNumber").focus();
    attachAutoCursorMovement();
    updateDateAndShift();
}

// ✅ Attach Event Listeners for Auto Cursor Movement
function attachAutoCursorMovement() {
    const delay = 250;

    document.getElementById("partNumber").addEventListener("input", function () {
        setTimeout(() => {
            if (this.value.trim() !== "") {
                document.getElementById("huNumber").focus();
            }
        }, delay);
    });

    document.getElementById("huNumber").addEventListener("input", function () {
        setTimeout(() => {
            if (this.value.trim() !== "") {
                document.getElementById("serialNumber").focus();
            }
        }, delay);
    });

    document.getElementById("serialNumber").addEventListener("input", function () {
        setTimeout(() => {
            if (this.value.trim() !== "") {
                document.getElementById("quantity").focus();
            }
        }, delay);
    });

    document.getElementById("quantity").addEventListener("input", function () {
        setTimeout(() => {
            if (this.value.trim() !== "") {
                submitPalletInfo();
            }
        }, delay);
    });
}

// ✅ Function to Update Counters
function updateCounters() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let totalPallets = table.rows.length; // ✅ Pallets = number of rows
    let totalParts = 0;

    // ✅ Loop through all rows and sum up the Quantity column
    for (let i = 0; i < table.rows.length; i++) {
        let quantity = parseInt(table.rows[i].cells[4].innerText, 10) || 0;
        totalParts += quantity;
    }

    // ✅ Update the HTML with the correct values
    document.getElementById("palletCount").innerText = totalPallets; // ✅ Total Pallets
    document.getElementById("totalParts").innerText = totalParts; // ✅ Total Parts
}


// ✅ Modify submitPalletInfo to Update Counters
function submitPalletInfo() {
    let partNumber = document.getElementById("partNumber").value.trim();
    let huNumber = document.getElementById("huNumber").value.trim();
    let serialNumber = document.getElementById("serialNumber").value.trim();
    let quantity = document.getElementById("quantity").value.trim();
    let timestamp = new Date().toLocaleString();

    if (partNumber && huNumber && serialNumber && quantity) {
        let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
        let newRow = table.insertRow();

        // ✅ Ensure Row Numbering Starts at 1
        let rowIndex = table.rows.length; // Gets the correct row count

        newRow.innerHTML = `
            <td>${rowIndex}</td>
            <td>${partNumber}</td>
            <td>${huNumber}</td>
            <td>${serialNumber}</td>
            <td>${quantity}</td>
            <td>${timestamp}</td>
            <td><button class="delete-button" onclick="deleteRow(this)">❌ Delete</button></td>
        `;

        // ✅ Clear inputs & refocus for next scan
        document.getElementById("partNumber").value = "";
        document.getElementById("huNumber").value = "";
        document.getElementById("serialNumber").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("partNumber").focus();

        updateCounters(); // ✅ Ensure counters update
    }
}


// ✅ Modify deleteRow to Update Counters
function deleteRow(button) {
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateCounters(); // ✅ Update Counters
}


// ✅ Function to Update Row Numbers After Deletion
function updateRowNumbers() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1; // Update row numbers
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

    let dateElement = document.getElementById("currentDate");
    let shiftElement = document.getElementById("currentShift");

    if (dateElement && shiftElement) {
        dateElement.innerText = `📅 ${formattedDate}`;
        shiftElement.innerText = `🕒 ${shift}`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeInboundScreen();

    // ✅ Ensure menu button exists before attaching event listener
    let menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", function () {
            openSidebar();
        });
    }

    // ✅ Ensure close button exists before attaching event listener
    let closeSidebarBtn = document.getElementById("closeSidebarBtn");
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", function () {
            closeSidebar();
        });
    }

    // ✅ Ensure overlay exists before attaching event listener
    let overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", function () {
            closeSidebar();
        });
    }
});

// ✅ Open Sidebar Function
function openSidebar() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    if (sidebar && overlay) {
        sidebar.style.left = "0";
        overlay.style.display = "block"; // Show overlay
    }
}

// ✅ Close Sidebar Function
function closeSidebar() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    if (sidebar && overlay) {
        sidebar.style.left = "-250px";
        overlay.style.display = "none"; // Hide overlay
    }
}


// ✅ Close Sidebar Function
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; // Hide overlay
}



// ✅ Initialize Screen and Load Stored Data
function initializeInboundScreen() {
    document.getElementById("partNumber").focus();
    attachAutoCursorMovement();
    updateDateAndShift();
    loadStoredData(); // ✅ Load previous data on page load
}

// ✅ Save Table Data to Local Storage
function saveTableData() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let data = [];

    for (let i = 0; i < table.rows.length; i++) {
        let cells = table.rows[i].cells;
        data.push({
            rowNumber: cells[0].innerText,
            partNumber: cells[1].innerText,
            huNumber: cells[2].innerText,
            serialNumber: cells[3].innerText,
            quantity: cells[4].innerText,
            timestamp: cells[5].innerText
        });
    }

    localStorage.setItem("scannedPalletsData", JSON.stringify(data));
}

// ✅ Load Table Data from Local Storage
function loadStoredData() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let storedData = localStorage.getItem("scannedPalletsData");

    if (storedData) {
        let data = JSON.parse(storedData);
        table.innerHTML = ""; // Clear table before inserting data

        data.forEach((item, index) => {
            let newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.partNumber}</td>
                <td>${item.huNumber}</td>
                <td>${item.serialNumber}</td>
                <td>${item.quantity}</td>
                <td>${item.timestamp}</td>
                <td><button class="delete-button" onclick="deleteRow(this)">❌ Delete</button></td>
            `;
        });

        updateCounters();
    }
}

// ✅ Modify submitPalletInfo to Save Data
function submitPalletInfo() {
    let partNumber = document.getElementById("partNumber").value.trim();
    let huNumber = document.getElementById("huNumber").value.trim();
    let serialNumber = document.getElementById("serialNumber").value.trim();
    let quantity = document.getElementById("quantity").value.trim();
    let timestamp = new Date().toLocaleString();

    if (partNumber && huNumber && serialNumber && quantity) {
        let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
        let newRow = table.insertRow();

        let rowIndex = table.rows.length;

        newRow.innerHTML = `
            <td>${rowIndex}</td>
            <td>${partNumber}</td>
            <td>${huNumber}</td>
            <td>${serialNumber}</td>
            <td>${quantity}</td>
            <td>${timestamp}</td>
            <td><button class="delete-button" onclick="deleteRow(this)">❌ Delete</button></td>
        `;

        // ✅ Clear inputs & refocus
        document.getElementById("partNumber").value = "";
        document.getElementById("huNumber").value = "";
        document.getElementById("serialNumber").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("partNumber").focus();

        updateCounters();
        saveTableData(); // ✅ Save updated table data
    }
}

// ✅ Modify deleteRow to Save Data
function deleteRow(button) {
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateCounters();
    saveTableData(); // ✅ Save updated data after deletion
}

// ✅ Add Function to Clear Data on "New Truck"
function resetData() {
    let confirmReset = confirm("⚠️ Are you sure you want to reset the current scanned pallets? This action cannot be undone.");
    
    if (confirmReset) {
        document.getElementById("scannedPalletsTable").querySelector("tbody").innerHTML = "";
        updateCounters();
        localStorage.removeItem("scannedPalletsData"); // ✅ Clear stored data
        document.getElementById("partNumber").focus();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeInboundScreen();

    // ✅ Ensure the button exists before adding an event listener
    let newTruckButton = document.getElementById("newTruckButton");
    if (newTruckButton) {
        newTruckButton.addEventListener("click", function () {
            let confirmation = confirm("⚠️ Warning: This will reset all scanned pallets and counters. Do you want to continue?");
            if (confirmation) {
                resetInboundProcess();
            }
        });
    }

    let saveButton = document.getElementById("saveToGoogleSheets");
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            sendInboundDataToGoogleSheets();
        });
    }
});

// ✅ Function to Send Inbound Data to Google Sheets
function sendInboundDataToGoogleSheets() {
    let table = document.getElementById("scannedPalletsTable").querySelector("tbody");
    let rows = table.getElementsByTagName("tr");
    let data = [];

    if (rows.length === 0) {
        alert("⚠️ No scanned pallets to save!");
        return;
    }

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;
        data.push({
            timestamp: cells[5].innerText,  // ✅ Time
            date: new Date().toLocaleDateString(), // ✅ Date
            partNumber: cells[1].innerText, // ✅ Part Number
            huNumber: cells[2].innerText,   // ✅ HU Number
            serialNumber: cells[3].innerText, // ✅ Serial Number
            quantity: cells[4].innerText   // ✅ Quantity
        });
    }

    fetch("https://script.google.com/macros/s/AKfycbzEvJ7pnvm3EObmMrSp25fo2djXwyN_Bp6XNpUZM55sg69fWreHjGOV_FsX1in94VJB/exec", {
        method: "POST",
        mode: "no-cors",  // ✅ Bypass CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboundData: data })
    })
    .then(() => {
        console.log("✅ Inbound data saved successfully!");
        alert("✅ Inbound data has been sent to Google Sheets!");
    })
    .catch(error => console.error("❌ Error:", error));
}
