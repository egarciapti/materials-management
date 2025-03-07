// ✅ Wait for the page to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    // ✅ Add event listeners for buttons
    document.getElementById("platform1Button").addEventListener("click", () => {
        navigatePlatform("Platform 1");
    });

    document.getElementById("platform2Button").addEventListener("click", () => {
        navigatePlatform("Platform 2");
    });

    // ✅ Ensure Charts Button Navigates Correctly
    document.getElementById("chartsButton").addEventListener("click", () => {
        window.location.href = "../../Dashboards/Dashboards.html"; // ✅ Adjusted path
    });
});

// ✅ Function to Store Platform Selection and Navigate to scanning.html
function navigatePlatform(platform) {
    localStorage.setItem("selectedPlatform", platform);
    window.location.href = "scanning.html"; // ✅ Ensure scanning.html is in the same folder
}

// ✅ Open Sidebar
document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; // Show overlay
});

// ✅ Close Sidebar When Clicking the X Button
document.querySelector(".close-btn").addEventListener("click", closeSidebar);

// ✅ Close Sidebar When Clicking Outside
document.getElementById("overlay").addEventListener("click", closeSidebar);

// ✅ Close Sidebar Function
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; // Hide overlay
}
