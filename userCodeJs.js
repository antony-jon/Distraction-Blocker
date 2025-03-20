submitButton.addEventListener("click", async function () {
    const enteredCode = codeInput.value.trim();
    if (!enteredCode) {
        alert("Please enter a valid code!");
        return;
    }

    try {
        // Verify code with database
        const response = await fetch(`http://localhost:5000/api/verify-admin?code=${enteredCode}`);
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response format (not JSON)");
        }

        const data = await response.json();

        if (!response.ok || !data.valid) {
            alert("Invalid admin code! Please try again.");
            return;
        }

        // Fetch blocked sites for this admin
        const blockedSitesResponse = await fetch(`http://localhost:5000/api/blocked-sites?adminCode=${enteredCode}`);
        
        // Same JSON validation check
        const contentType2 = blockedSitesResponse.headers.get("content-type");
        if (!contentType2 || !contentType2.includes("application/json")) {
            throw new Error("Invalid response format (not JSON)");
        }

        const blockedSites = await blockedSitesResponse.json();

        // Store blocked sites in Chrome storage
        chrome.storage.sync.set({ adminCode: enteredCode, blockedSites }, function () {
            console.log("Admin code verified & blocked sites saved:", blockedSites);
            window.location.href = "blocked.html"; // Redirect to blocked page
        });

    } catch (error) {
        console.error("Error verifying admin code:", error);
        alert("Something went wrong. Please try again later.");
    }
});
