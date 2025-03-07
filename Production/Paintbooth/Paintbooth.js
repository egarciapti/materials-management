// ✅ Ensure Sidebar Works
document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menu-btn");
    let overlay = document.getElementById("overlay");
    let closeBtn = document.querySelector(".close-btn");

    if (menuButton) menuButton.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    updateDateAndShift();
   
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

// ✅ Function to Update Date & Shift
function updateDateAndShift() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString("en-US", options);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let shift = "Off Shift"; // Default to Off Shift

    if ((hours === 7 && minutes >= 0) || (hours >= 8 && hours < 15) || (hours === 15 && minutes <= 30)) {
        shift = "1st Shift";
    } else if ((hours === 15 && minutes >= 31) || (hours >= 16 && hours < 24)) {
        shift = "2nd Shift";
    }

    document.getElementById("currentDate").innerHTML = `📅 Date: <b>${formattedDate}</b>`;
    document.getElementById("currentShift").innerHTML = `🕒 Shift: <b>${shift}</b>`;
}


