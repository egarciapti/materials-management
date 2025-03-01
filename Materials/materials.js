// ✅ Wait for the page to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("backToMain").addEventListener("click", () => {
        window.location.href = "../index.html"; // ✅ Navigate back to the main menu
    });
});

// ✅ Function to Navigate to Different Sections
function navigate(page) {
    window.location.href = "./" + page; // ✅ Ensure correct folder navigation
}