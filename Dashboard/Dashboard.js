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

// ✅ Google Apps Script Web App URL
const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbxvcq30l_-VnzajDymgstR0IiVBFaelDsrZWSoRJILoVWeK1XstUK2jvZn4zAuVpgHVMg/exec";

// ✅ Function to Fetch Defects Data from Google Apps Script
async function fetchDefectsData() {
    try {
        const response = await fetch(googleAppsScriptURL);
        const jsonData = await response.json();

        if (!jsonData || jsonData.status === "error") {
            console.error("❌ Error fetching defect data:", jsonData.message);
            return;
        }

        console.log("✅ Successfully fetched defect data:", jsonData);
        processDefectsData(jsonData);

    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

// ✅ Function to Process and Display the Defect Chart
function processDefectsData(data) {
    let currentShift = document.getElementById("currentShift").innerText.split(":")[1].trim();
    let defectCounts = {};

    // ✅ Filter data for the current shift
    data.forEach(entry => {
        if (entry.shift === currentShift) {
            defectCounts[entry.defectName] = (defectCounts[entry.defectName] || 0) + 1;
        }
    });

    // ✅ Convert data to chart format
    let chartData = [["Defect Name", "Count"]];
    for (let defect in defectCounts) {
        chartData.push([defect, defectCounts[defect]]);
    }

    // ✅ Load Google Charts and Draw
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
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
}

// ✅ Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
});
