async function verifyPassword(adminCode, password) {
    try {
        const response = await fetch("http://localhost:5000/api/verify-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminCode, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Invalid password");

        return data.isValid; // Assuming API returns { isValid: true/false }
    } catch (error) {
        console.error("Error verifying password:", error.message);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const unlockBtn = document.getElementById("unlockBtn");

    unlockBtn.addEventListener("click", async () => {
        const password = document.getElementById("unlockPassword").value.trim();
        if (!password) return alert("Please enter a password!");

        chrome.storage.local.get("adminCode", async (data) => {
            const adminCode = data.adminCode;
            if (!adminCode) return alert("Admin code missing! Please re-enter.");

            const isValid = await verifyPassword(adminCode, password);
            if (!isValid) return alert("Incorrect password!");

            chrome.storage.local.remove(["blockedSites", "adminCode"], () => {
                alert("Unlocked successfully!");
                window.location.href = "dashboard.html"; // Redirect to main page
            });
        });
    });
});
