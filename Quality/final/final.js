// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
});

// ✅ Function to Open Sidebar
function openSidebar() {
    console.log("📂 Opening Sidebar"); 
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block"; 
}

// ✅ Function to Close Sidebar
function closeSidebar() {
    console.log("📂 Closing Sidebar"); 
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none"; 
}

document.addEventListener("DOMContentLoaded", function () {
    // Select all buttons inside the inspection grid
    const buttons = document.querySelectorAll(".inspection-button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // Find the corresponding counter (next sibling element)
            const counter = document.getElementById(`counter${index + 1}`);
            if (counter) {
                let count = parseInt(counter.innerText, 10) || 0; // Get current count
                counter.innerText = count + 1; // Increase by 1
            }
        });
    });
});
