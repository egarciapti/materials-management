// ✅ Wait for the page to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Load").addEventListener("click", () => {
        navigatePlatform("Load");
    });

    document.getElementById("Paintbooth").addEventListener("click", () => {
        navigatePlatform("Paint booth");
    });

    document.getElementById("backToMain").addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});

// ✅ Function to Store Platform Selection and Navigate
function navigatePlatform(platform) {
    localStorage.setItem("selectedPlatform", platform);
    window.location.href = "/materials-management/Production/Load/scanning.html";
}


document.addEventListener("DOMContentLoaded", function () {
    // ✅ Open Sidebar
    document.getElementById("menu-btn").addEventListener("click", function () {
        document.getElementById("sidebar").style.left = "0";
        document.getElementById("overlay").style.display = "block"; // Show overlay
    });

    // ✅ Close Sidebar When Clicking the X Button
    document.querySelector(".close-btn").addEventListener("click", closeSidebar);

    // ✅ Close Sidebar When Clicking Outside
    document.getElementById("overlay").addEventListener("click", closeSidebar);
});

// ✅ Close Sidebar Function
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; // Hide overlay
}

// ✅ Wait for the page to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Load").addEventListener("click", () => {
        navigatePlatform("Load");
    });

    document.getElementById("Paintbooth").addEventListener("click", () => {
        navigatePlatform("Paint Booth");
    });

    document.getElementById("chartsButton").addEventListener("click", () => {
        window.location.href = "../Dashboards/Dashboards.html"; // ✅ Corrected path
    });

    // ✅ New Event Listener for Critical Parts Button
    document.getElementById("criticalPartsButton").addEventListener("click", () => {
        window.location.href = "Critical/critical.html"; // ✅ Adjust the path if needed
    });

    document.getElementById("backToMain").addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});


// ✅ Function to Store Platform Selection and Navigate
function navigatePlatform(platform) {
    localStorage.setItem("selectedPlatform", platform);
    window.location.href = "scanning.html";
}

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Open Sidebar
    document.getElementById("menu-btn").addEventListener("click", function () {
        document.getElementById("sidebar").style.left = "0";
        document.getElementById("overlay").style.display = "block"; // Show overlay
    });

    // ✅ Close Sidebar When Clicking the X Button
    document.querySelector(".close-btn").addEventListener("click", closeSidebar);

    // ✅ Close Sidebar When Clicking Outside
    document.getElementById("overlay").addEventListener("click", closeSidebar);
});

// ✅ Close Sidebar Function
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; // Hide overlay
}
