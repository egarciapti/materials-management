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
                title: "", 
                minValue: 0,
                textStyle: { fontSize: 14 }
            },
            vAxis: { 
                titleTextStyle: { fontSize: 16, bold: true },
                textStyle: { fontSize: 14 }
            },
            width: "100%",  
    height: "100%",
    chartArea: { left: "10%", top: "10%", width: "80%", height: "80%" },  // ✅ Adjusted space for centering
    hAxis: { textStyle: { fontSize: 10 } },
    vAxis: { textStyle: { fontSize: 14 } },
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
        const response = await fetch(scanningChartURL);
        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            console.warn("⚠️ No scanning data found for today's date and shift.");
            document.getElementById("chartBox2").innerHTML = "<p>No data available for today's shift.</p>";
            return;
        }

        console.log("📦 Scanning Data:", data);
        drawScanningChart(data);

    } catch (error) {
        console.error("❌ Error fetching scanning data:", error);
    }
}

function drawScanningChart(data) {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
        let chartData = [["Part Number", "Total Quantity"]];
        let totalScanned = 0;

        Object.entries(data).forEach(([part, count]) => {
            chartData.push([String(part), count]); // ✅ Ensure part numbers are treated as strings
            totalScanned += count;
        });

        document.getElementById("totalScannedCounter").innerText = `Total Scanned: ${totalScanned}`;

        let chartTable = google.visualization.arrayToDataTable(chartData);
        let options = {
            titleTextStyle: { fontSize: 18, bold: true, color: "#004080" },
            hAxis: { 
                textStyle: { 
                    fontSize: 10  // ✅ Reduce font size for better fit
                },
                slantedText: true, 
                slantedTextAngle: 45,  // ✅ Adjust angle for better spacing
                showTextEvery: 1,  
                textPosition: "out", 
                maxAlternation: 1,  // ✅ Ensures all labels are shown
                minTextSpacing: 1,  // ✅ Reduces space between labels
                maxTextLines: 2     // ✅ Allows labels to wrap if needed
            },
            
            
            vAxis: { 
                textStyle: { fontSize: 14 },
                minValue: 0,
            },
            legend: { position: "none" }, 
            colors: ["#2E86C1"],
            chartArea: { 
                left: 50, 
                top: 30,  // ✅ Increases the top space, pushing the chart down
                width: "85%", 
                height: "60%"  // ✅ Decreases height slightly to maintain spacing
            }
            
        };
        

        let chart = new google.visualization.ColumnChart(document.getElementById("chartBox2"));
        chart.draw(chartTable, options);
        console.log("✅ Scanning Chart Updated.");
    });
}


// ✅ Call the function on page load
document.addEventListener("DOMContentLoaded", function () {
    fetchScanningData();
});
