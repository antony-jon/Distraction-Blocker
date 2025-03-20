document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
    const toggleText = document.getElementById("toggleText");

    // Load saved toggle state
    chrome.storage.local.get("blockingEnabled", (data) => {
        if (data.blockingEnabled) {
            toggle.classList.add("active");
            toggleText.textContent = "ON";
        }
    });

    // Handle toggle click
    toggle.addEventListener("click", () => {
        const isActive = toggle.classList.toggle("active");
        toggleText.textContent = isActive ? "ON" : "OFF";

        // Save state
        chrome.storage.local.set({ "blockingEnabled": isActive }, () => {
            // Refresh the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });
});