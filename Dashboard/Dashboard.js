document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");
    let menuButton = document.getElementById("menu-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    initializeDashboard(); // Ensures the date & shift info is loaded correctly
});

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

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString("en-US", options);

    let hours = now.getHours();
    let shift = determineShiftFromTime(hours);

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;
}

// ✅ Function to Determine Shift Based on Time
function determineShiftFromTime(hour) {
    if ((hour >= 7 && hour < 15) || (hour === 15 && new Date().getMinutes() <= 30)) {
        return "1st Shift";
    } else if (hour > 15 || hour < 7) {
        return "2nd Shift";
    }
    return "Off Shift";
}


// ✅ Function to Initialize Dashboard
function initializeDashboard() {
    updateDateAndShift();
    fetchDefectsData();
}

// ✅ Google Apps Script Web App URL (Replace with your actual URL)
const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbxvcq30l_-VnzajDymgstR0IiVBFaelDsrZWSoRJILoVWeK1XstUK2jvZn4zAuVpgHVMg/exec";

// ✅ Fetch Defects Data from Google Apps Script
async function fetchDefectsData() {
    try {
        const response = await fetch(googleAppsScriptURL, { mode: "no-cors" });

        // Since "no-cors" doesn't allow direct response reading, we assume success
        console.log("🚀 Data request sent successfully. The response is blocked due to no-cors.");
        
        // Call process function after a delay to allow data update in the spreadsheet
        setTimeout(() => {
            console.log("⏳ Waiting for Google Sheets update...");
            processDefectsData();
        }, 3000); // Wait 3 seconds before processing (adjust as needed)

    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

// ✅ Function to Process and Display the Defect Chart
function processDefectsData() {
    // ✅ Extract shift from title bar
    let currentShift = document.getElementById("currentShift").innerText.split(":")[1].trim();

    // ✅ Use Google Visualization API to fetch the latest sheet data
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
        const query = new google.visualization.Query(googleAppsScriptURL);
        query.send((response) => {
            const dataTable = response.getDataTable();
            if (!dataTable) {
                console.error("❌ Error: No data received from Google Sheets.");
                return;
            }

            let defectCounts = {};

            // ✅ Read data and filter by shift
            for (let i = 0; i < dataTable.getNumberOfRows(); i++) {
                let shift = dataTable.getValue(i, 2); // Column C (Shift)
                let defectName = dataTable.getValue(i, 3); // Column D (Defect Name)

                if (shift === currentShift) {
                    defectCounts[defectName] = (defectCounts[defectName] || 0) + 1;
                }
            }

            // ✅ Convert data to chart format
            let chartData = [["Defect Name", "Count"]];
            for (let defect in defectCounts) {
                chartData.push([defect, defectCounts[defect]]);
            }

            // ✅ Draw Chart
            let chart = new google.visualization.BarChart(document.getElementById("chartBox1"));
            let chartTable = google.visualization.arrayToDataTable(chartData);

            chart.draw(chartTable, {
                title: "Defects by Shift",
                hAxis: { title: "Defect Count", minValue: 0 },
                vAxis: { title: "Defect Type" },
                legend: { position: "none" },
                colors: ["#FF5733"]
            });

            console.log("✅ Defect chart updated successfully.");
        });
    });
}

// ✅ Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
});
