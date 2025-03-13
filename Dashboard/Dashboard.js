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
                textStyle: { fontSize: 14 } // ✅ Bigger X-axis numbers
            },
            vAxis: { 
                title: "Defect Type",
                titleTextStyle: { fontSize: 16, bold: true }, // ✅ Bigger Y-axis label
                textStyle: { fontSize: 14 } // ✅ Bigger Y-axis text
            },
            legend: { position: "none" },
            colors: ["#FF5733"],
            chartArea: { left: 120, top: 40, width: "75%", height: "80%" } // ✅ Moves chart to the right
        });
        

        console.log("✅ Defect chart updated successfully.");
    });
}



// ✅ Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
});


// ✅ Google Apps Script Web App URL for Adhesion Data
const adhesionGaugeScriptURL = "https://script.google.com/macros/s/AKfycbwInHlHKaUHSsli8x6KjMnk-PVaZAR6t-VxflJ7eCBQbsTcEUDjsZaNYzvR9IyjeRnyBg/exec";

// ✅ Fetch Adhesion Data from Google Sheets
async function fetchAdhesionData() {
    try {
        const response = await fetch(adhesionGaugeScriptURL, { mode: "no-cors" });

        console.log("🚀 Data request sent successfully for Adhesion Gauge.");
        
        // Delay processing to allow the spreadsheet to update
        setTimeout(() => {
            console.log("⏳ Waiting for Google Sheets update...");
            processAdhesionData();
        }, 3000);

    } catch (error) {
        console.error("❌ Error fetching Adhesion data:", error);
    }
}

// ✅ Process Adhesion Data and Draw Gauge Chart
function processAdhesionData() {
    google.charts.load("current", { packages: ["gauge"] });
    google.charts.setOnLoadCallback(async () => {
        try {
            const response = await fetch(adhesionGaugeScriptURL);
            const data = await response.json();
            let adhesionValue = data.adhesion;

            // ✅ Convert Adhesion values ("1A" to "5A") into numeric scale
            const adhesionMapping = { "1A": 1, "2A": 2, "3A": 3, "4A": 4, "5A": 5 };
            let numericAdhesion = adhesionMapping[adhesionValue] || 0; // Default to 0 if not found

            // ✅ Prepare Data for the Gauge Chart
            let chartData = google.visualization.arrayToDataTable([
                ["Label", "Value"],
                ["Adhesion", numericAdhesion]
            ]);

            let options = {
                width: 200, // Reduce width
                height: 200, // Reduce height
                chartArea: { left: 20, top: 20, width: "80%", height: "80%" }, // Adjust margins
                redFrom: 0, redTo: 2,
                yellowFrom: 2, yellowTo: 3,
                greenFrom: 3, greenTo: 5,
                minorTicks: 1,
                max: 5,
                fontSize: 14 // Reduce font size
            };
            

            let chart = new google.visualization.Gauge(document.getElementById("chartBox3"));
            chart.draw(chartData, options);

            console.log("✅ Adhesion Gauge Chart updated. Value:", adhesionValue);
        } catch (error) {
            console.error("❌ Error processing Adhesion data:", error);
        }
    });
}

// ✅ Initialize Dashboard (Include Adhesion Chart)
document.addEventListener("DOMContentLoaded", function () {
    updateDateAndShift();
    fetchDefectsData();
    fetchAdhesionData(); // ✅ Fetch Adhesion Data
});
