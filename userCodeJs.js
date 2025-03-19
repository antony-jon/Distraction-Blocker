async function getBlockedSites(adminCode) {
    const response = await fetch(`http://localhost:5000/api/blocked-sites?adminCode=${adminCode}`);
    if (!response.ok) {
        console.error("Error fetching blocked sites");
        return [];
    }
    return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const submitBtn = document.getElementById("submitAdminCode");
    submitBtn.addEventListener("click", async () => {
        const adminCode = document.getElementById("adminCodeInput").value.trim();
        if (!adminCode) return alert("Please enter an admin code!");
        
        const blockedSites = await getBlockedSites(adminCode);
        chrome.storage.local.set({ blockedSites }, () => {
            alert("Blocked sites updated!");
        });
    });
});