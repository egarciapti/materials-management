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

// ✅ Function to Fetch Data from Google Spreadsheet
function fetchDefectsData() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/1tJ3fmzrefXDdsiKqVHJtEmjALTbV1PvEz6H0GKizONc/gviz/tq?tqx=out:json&sheet=Data";
    
    fetch(sheetURL)
        .then(res => res.text())
        .then(data => {
            const json = JSON.parse(data.substring(47).slice(0, -2)); // ✅ Parse Google Sheets JSON
            const rows = json.table.rows.map(row => ({
                time: row.c[0]?.v || "",
                date: row.c[1]?.v || "",
                shift: row.c[2]?.v || "",
                defect: row.c[3]?.v || ""
            }));

            const currentShift = document.getElementById("currentShift").innerText.split(": ")[1]; // Get Shift from Title Bar
            const filteredData = rows.filter(row => row.shift === currentShift);

            processDefectData(filteredData);
        })
        .catch(error => console.error("❌ Error fetching data:", error));
}

// ✅ Function to Process Defects and Render Chart
function processDefectData(data) {
    const defectCounts = {};
    
    data.forEach(row => {
        if (row.defect) {
            defectCounts[row.defect] = (defectCounts[row.defect] || 0) + 1;
        }
    });

    const labels = Object.keys(defectCounts);
    const values = Object.values(defectCounts);

    renderDefectChart(labels, values);
}

// ✅ Function to Render Defects Chart
function renderDefectChart(labels, values) {
    const ctx = document.getElementById("defectsChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Defects Count",
                data: values,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}