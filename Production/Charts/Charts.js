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
        : (hours >= 15 && hours <= 23) ? "2nd Shift"
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

    const url = `https://script.google.com/macros/s/AKfycbwBWcpHc8GILRYcIoF9czoyOUtGYtra4Ni1fmCIlDHJ_na1UEJtez4C4rDBAaZ0pICZ/exec?date=${encodeURIComponent(selectedDate)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ API Response:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ No data found for the selected date:", selectedDate);
            return null;
        }

        // ✅ Convert Date Format to Match API Data
        const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

        // ✅ Filter Data by Selected Date and Shift (Determining Shift from Time)
        const filteredData = data.filter(entry => {
            const entryDate = new Date(entry.date).toISOString().split("T")[0];

            // ✅ Convert time to proper hours
            const entryHour = new Date(entry.time).getUTCHours(); // Ensure proper timezone handling

            // ✅ Determine Shift based on hours
            const shiftFromTime =
                (entryHour >= 7 && entryHour < 15) ? "1st Shift" :
                (entryHour >= 15 && entryHour < 24) ? "2nd Shift" :
                "Off Shift";

            return entryDate === formattedDate && shiftFromTime === selectedShift;
        });

        console.log("📋 Filtered Data:", filteredData);

        if (filteredData.length === 0) {
            console.warn("⚠️ No data found for the selected date & shift:", formattedDate, selectedShift);
            return null;
        }

        // ✅ Aggregate total scanned parts by Part Number
        const totalPartsData = {};
        const hourlyPartsData = {};

        filteredData.forEach(entry => {
            const partNumber = entry.partNumber.toString();
            const quantity = parseInt(entry.quantity, 10) || 0;
            const entryHour = new Date(entry.time).getUTCHours();
            const hourLabel = `${entryHour}:00 - ${entryHour + 1}:00`;

            // Aggregate Total Parts by Part Number
            if (!totalPartsData[partNumber]) {
                totalPartsData[partNumber] = 0;
            }
            totalPartsData[partNumber] += quantity;

            // Aggregate Total Parts by Hour
            if (!hourlyPartsData[hourLabel]) {
                hourlyPartsData[hourLabel] = 0;
            }
            hourlyPartsData[hourLabel] += quantity;
        });

        console.log("🔹 Total Parts Data:", totalPartsData);
        console.log("🔹 Hourly Parts Data:", hourlyPartsData);

        return { totalParts: totalPartsData, hourlyParts: hourlyPartsData };
    } catch (error) {
        console.error("❌ Error fetching API data:", error);
        return null;
    }
}

// ✅ Function to Update Charts When Date or Shift Changes
async function updateCharts() {
    console.log("🔄 Updating charts with new selection...");

    const data = await fetchFilteredData();

    if (!data) {
        console.error("❌ No valid data received, charts won't update.");
        return;
    }

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
