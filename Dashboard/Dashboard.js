document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");
    let menuButton = document.getElementById("menu-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    initializeDashboard(); // Ensures the date & shift info is loaded correctly
    updateDateAndShift();
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
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let shift = determineShiftFromTime(hours, minutes);

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;
}

// ✅ Function to Determine Shift Based on Time
function determineShiftFromTime(hour, minutes) {
    // Convert time into minutes since midnight
    let totalMinutes = hour * 60 + minutes;

    // 1st Shift: 07:00 - 15:30
    if (totalMinutes >= 420 && totalMinutes <= 930) {
        return "1st Shift";
    }
    // 2nd Shift: 15:31 - 00:00
    else if (totalMinutes >= 931 || totalMinutes === 0) {
        return "2nd Shift";
    }
    // Off Shift: 00:01 - 06:59
    else {
        return "Off Shift";
    }
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
        let currentShift = document.getElementById("currentShift").innerText.split(":")[1].trim();
        
        // ✅ Append shift to the request URL
        let urlWithParams = `${googleAppsScriptURL}?shift=${encodeURIComponent(currentShift)}`;
        
        const response = await fetch(urlWithParams);
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
    let defectCounts = {};

    // ✅ Extract current date & shift from the title bar
    let currentDateText = document.getElementById("currentDate").innerText.split(":")[1].trim();
    let currentShift = document.getElementById("currentShift").innerText.split(":")[1].trim();

    // ✅ Convert displayed date to YYYY-MM-DD format
    let formattedDateObj = new Date(currentDateText);
    let formattedDate = formattedDateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

    console.log(`🔍 Filtering Data for Date: ${formattedDate}, Shift: ${currentShift}`);
    
    // ✅ Log the raw fetched data
    console.log("✅ Raw Data from Google Sheets:", data);

    // ✅ Loop through data & filter by date & shift
    data.forEach(entry => {
        let entryDate = String(entry.date || "").trim(); // Ensure it's a string & trimmed
        let entryShift = String(entry.shift || "").trim();
        let defectName = String(entry.defectName || "").trim();

        console.log(`📌 Checking Entry: Date: ${entryDate}, Shift: ${entryShift}, Defect: ${defectName}`);

        // ✅ Normalize date formats to ensure exact match
        let normalizedEntryDate = new Date(entryDate).toISOString().split("T")[0]; // Convert to YYYY-MM-DD

        if (normalizedEntryDate === formattedDate && entryShift.toLowerCase() === currentShift.toLowerCase()) {
            defectCounts[defectName] = (defectCounts[defectName] || 0) + 1;
        }
    });

    console.log("📊 Filtered Defect Data:", defectCounts);

    // ✅ Convert data to chart format
    let chartData = [["Defect Name", "Count"]];
    for (let defect in defectCounts) {
        chartData.push([String(defect), Number(defectCounts[defect])]); // Ensure correct types
    }

    console.log("📈 Chart Data:", chartData);

    // ✅ Ensure we have valid data to draw
    if (chartData.length === 1) {
        console.warn("⚠️ No defects found for the selected date and shift.");
        document.getElementById("chartBox1").innerHTML = "<p>No defects recorded for this shift.</p>";
        return;
    }

    // ✅ Load Google Charts and Draw
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
        let chart = new google.visualization.BarChart(document.getElementById("chartBox1"));
        let chartTable = google.visualization.arrayToDataTable(chartData);

        chart.draw(chartTable, {
            hAxis: { 
                title: "Defect Count", 
                minValue: 0,
                textStyle: { fontSize: 14 }
            },
            vAxis: { 
                title: "Defect Type",
                titleTextStyle: { fontSize: 16, bold: true },
                textStyle: { fontSize: 14 }
            },
            legend: { position: "none" },
            colors: ["#FF5733"],
            chartArea: { left: 120, top: 20, width: "75%", height: "75%" } // ✅ Adjust top spacing
        });
        
        
        

        console.log("✅ Defect chart updated successfully.");
    });
}



// ✅ Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
});


// ✅ Google Apps Script Web App URL for Both Adhesion & Film Thickness
const gaugeScriptURL = "https://script.google.com/macros/s/AKfycbwInHlHKaUHSsli8x6KjMnk-PVaZAR6t-VxflJ7eCBQbsTcEUDjsZaNYzvR9IyjeRnyBg/exec";

// ✅ Fetch Data for Both Charts
async function fetchGaugeData() {
    try {
        const response = await fetch(gaugeScriptURL);
        const data = await response.json();
        console.log("🚀 Gauge Data Fetched:", data);
        processGaugeData(data);
    } catch (error) {
        console.error("❌ Error fetching Gauge data:", error);
    }
}

// ✅ Process Data & Draw Gauges for Adhesion & Film Thickness
function processGaugeData(data) {
    google.charts.load("current", { packages: ["gauge"] });
    google.charts.setOnLoadCallback(() => {
        try {
            const adhesionValue = data.adhesion;
            const filmThicknessValue = data.filmThickness;

            // ✅ Convert Adhesion values ("1A" to "5A") into numeric scale
            const adhesionMapping = { "1A": 1, "2A": 2, "3A": 3, "4A": 4, "5A": 5 };
            let numericAdhesion = adhesionMapping[adhesionValue] || 0;

            // ✅ Prepare Data for Adhesion Chart
            let adhesionChartData = google.visualization.arrayToDataTable([
                ["Label", "Value"],
                ["Adhesion", numericAdhesion]
            ]);

            // ✅ Prepare Data for Film Thickness Chart
            let filmThicknessChartData = google.visualization.arrayToDataTable([
                ["Label", "Value"],
                ["Thickness", filmThicknessValue]
            ]);

            let options = {
                width: 200, height: 200,
                redFrom: 0, redTo: 2,
                yellowFrom: 2, yellowTo: 2.49,
                greenFrom: 2.5, greenTo: 5,
                minorTicks: 1,
                max: 5,
                fontSize: 14
            };

            // ✅ Draw the Adhesion Gauge
            let adhesionChart = new google.visualization.Gauge(document.getElementById("chartBox3"));
            adhesionChart.draw(adhesionChartData, options);

            // ✅ Draw the Film Thickness Gauge
            let thicknessChart = new google.visualization.Gauge(document.getElementById("chartBox3B"));
            thicknessChart.draw(filmThicknessChartData, options);

            console.log("✅ Gauges Updated: Adhesion:", numericAdhesion, "Thickness:", filmThicknessValue);

        } catch (error) {
            console.error("❌ Error processing Gauge data:", error);
        }
    });
}

// ✅ Initialize Dashboard with Both Gauges
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
    fetchGaugeData(); // ✅ Fetch Adhesion & Thickness Data
});

const scanningChartURL = "https://script.google.com/macros/s/AKfycbwqFc-Vw0xIUe2rnu5l8QYxTIqhYnXOesnxk-rXia4RPQmSRaHMOGQHLtNALKuX2zwfnA/exec";



async function fetchScanningData() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwqFc-Vw0xIUe2rnu5l8QYxTIqhYnXOesnxk-rXia4RPQmSRaHMOGQHLtNALKuX2zwfnA/exec"); // ✅ Replace with actual URL
        const jsonData = await response.json();

        if (!jsonData || jsonData.status === "error") {
            console.error("❌ Error fetching scanning data:", jsonData.message);
            return;
        }

        console.log("✅ Successfully fetched scanning data:", jsonData);

        // ✅ Prepare Data for Chart
        let chartData = [["Part Number", "Total Quantity"]];
        jsonData.forEach(entry => {
            chartData.push([String(entry.partNumber), Number(entry.quantity)]); // ✅ Convert data correctly
        });

        console.log("📊 Chart Data:", chartData);

        // ✅ Ensure Data Exists Before Drawing Chart
        if (chartData.length > 1) {
            drawScanningChart(chartData);
        } else {
            document.getElementById("chartBox2").innerHTML = "<p>No scanning data available.</p>";
        }

    } catch (error) {
        console.error("❌ Error fetching scanning data:", error);
    }
}

function drawScanningChart(chartData) {
    // ✅ Load Google Charts and Draw
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
        let chart = new google.visualization.ColumnChart(document.getElementById("chartBox2"));
        let chartTable = google.visualization.arrayToDataTable(chartData);

        chart.draw(chartTable, {
            title: "Total Pieces by Part Number",
            legend: { position: "none" }, // ✅ Hide legend
            hAxis: { 
                textStyle: { fontSize: 14 }, // ✅ Show part numbers properly under bars
                title: "", // ✅ Remove x-axis title
                slantedText: false // ✅ Ensure part numbers appear straight under bars
            },
            vAxis: { 
                textStyle: { fontSize: 14 },
                title: "", // ✅ Remove y-axis title
                minValue: 0
            },
            colors: ["#4B85CD"], // ✅ Keep or change color as needed
            chartArea: { left: 50, top: 30, width: "85%", height: "75%" } // ✅ Adjust chart area
        });

        console.log("✅ Updated chart with part numbers under bars and no axis titles.");
    });
}


// ✅ Call the function on page load
document.addEventListener("DOMContentLoaded", function () {
    fetchScanningData();
});
