// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    initializeDashboardScreen();

    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    // ✅ Add event listeners to detect selection changes
    document.getElementById("datePicker").addEventListener("change", updateCharts);
    document.getElementById("shiftPicker").addEventListener("change", updateCharts);
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

// ✅ Load Chart.js Properly Before Initializing
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/charts.js";
script.onload = initializeDashboardScreen;
document.head.appendChild(script);

// ✅ Store Chart Instances Globally
let scannedPartsChart = null;
let hourlyScannedPartsChart = null;

// ✅ Function to Initialize Dashboard Screen
function initializeDashboardScreen() {
    updateDateAndShift();

    // ✅ Set default values for Date & Shift selection
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("datePicker").value = today;
    document.getElementById("shiftPicker").value = getCurrentShift();

    // ✅ Render Empty Charts Before Updating
    renderScannedPartsChart();
    renderHourlyScannedPartsChart();

    // ✅ Load Charts with Default Data
    updateCharts();
}

// ✅ Function to Get Current Shift Based on Time
function getCurrentShift() {
    let hours = new Date().getHours();
    return (hours >= 7 && hours < 15) ? "1st Shift"
        : (hours >= 15 && hours < 23) ? "2nd Shift"
        : "Off Shift";
}

// ✅ Function to Update Date & Shift Display
function updateDateAndShift() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString("en-US", options);

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${getCurrentShift()}</b>`;
}

// ✅ Function to Fetch Data Based on Selected Date & Shift
async function fetchFilteredData() {
    const selectedDate = document.getElementById("datePicker").value;
    const selectedShift = document.getElementById("shiftPicker").value;

    console.log("🔎 Fetching data for Date:", selectedDate, "| Shift:", selectedShift);

    const url = "https://script.google.com/macros/s/AKfycbxKS6xL2QwuiCv5Ehq9MnhPaSxu9NAw2i0rGjSTV509BKWExOwyRvo5oZWFKERhzvA/exec"; // 🔴 Replace with your Google Apps Script URL

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ API Response:", data);

        // ✅ Filter Data by Selected Date
        const filteredData = data.filter(entry => entry.date === selectedDate);

        // ✅ Process Data for Charts
        const totalParts = {};
        const hourlyParts = {};

        filteredData.forEach(entry => {
            let hour = entry.time.split(":")[0] + ":00"; // Extract hour from time

            // ✅ Aggregate Total Parts by Part Number
            if (totalParts[entry.partNumber]) {
                totalParts[entry.partNumber] += parseInt(entry.quantity);
            } else {
                totalParts[entry.partNumber] = parseInt(entry.quantity);
            }

            // ✅ Aggregate Parts by Hour
            if (hourlyParts[hour]) {
                hourlyParts[hour] += parseInt(entry.quantity);
            } else {
                hourlyParts[hour] = parseInt(entry.quantity);
            }
        });

        console.log("🔍 Total Parts Data:", totalParts);
        console.log("🔍 Hourly Parts Data:", hourlyParts);

        updateScannedPartsChart(totalParts);
        updateHourlyScannedPartsChart(hourlyParts);

    } catch (error) {
        console.error("❌ Error fetching API data:", error);
    }
}


// ✅ Function to Update Charts When Date or Shift Changes
async function updateCharts() {
    console.log("🔄 Updating charts with new selection...");

    // ✅ Fetch the latest data from API
    const data = await fetchFilteredData();

    if (!data) {
        console.error("❌ No data received, charts won't update.");
        return;
    }

    // ✅ Update charts with new data
    updateScannedPartsChart(data.totalParts);
    updateHourlyScannedPartsChart(data.hourlyParts);
}

// ✅ Function to Destroy Existing Chart Before Redrawing
function destroyChart(chart) {
    if (chart) {
        chart.destroy();
    }
}

// ✅ Function to Render the Scanned Parts Chart
function renderScannedPartsChart() {
    const chartCanvas = document.getElementById("scannedPartsChart").getContext("2d");

    destroyChart(scannedPartsChart); // ✅ Destroy before creating new chart

    scannedPartsChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Total Scanned Parts",
                data: [],
                backgroundColor: "rgba(0, 123, 255, 0.6)",
                borderColor: "rgba(0, 123, 255, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ✅ Function to Render the Hourly Scanned Parts Chart
function renderHourlyScannedPartsChart() {
    const chartCanvas = document.getElementById("hourlyScannedPartsChart").getContext("2d");

    destroyChart(hourlyScannedPartsChart); // ✅ Destroy before creating new chart

    hourlyScannedPartsChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Scanned Parts Per Hour",
                data: [],
                backgroundColor: "rgba(255, 193, 7, 0.6)",
                borderColor: "rgba(255, 193, 7, 1)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ✅ Function to Update Scanned Parts Chart
function updateScannedPartsChart(data) {
    if (!scannedPartsChart) {
        console.error("❌ Scanned Parts Chart is not initialized.");
        return;
    }

    scannedPartsChart.data.labels = Object.keys(data);
    scannedPartsChart.data.datasets[0].data = Object.values(data);
    scannedPartsChart.update();
}


// ✅ Function to Update Hourly Scanned Parts Chart
function updateHourlyScannedPartsChart(data) {
    if (!hourlyScannedPartsChart) {
        console.error("❌ Hourly Scanned Parts Chart is not initialized.");
        return;
    }

    hourlyScannedPartsChart.data.labels = Object.keys(data);
    hourlyScannedPartsChart.data.datasets[0].data = Object.values(data);
    hourlyScannedPartsChart.update();
}


// ✅ Ensure the Date Picker Initializes with Today's Date
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("datePicker").value = today;
});
