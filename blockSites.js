document.addEventListener("DOMContentLoaded", () => {
    const userType = localStorage.getItem("userType");
    const adminCode = localStorage.getItem("adminCode");
    const userId = localStorage.getItem("userId"); 

    

    document.getElementById("blockSiteButton").addEventListener("click", () => blockSite(userType, userId, adminCode));
    
    fetchBlockedSites(userType, adminCode);
});

async function blockSite(userType, addedBy, adminCode) {
    const url = document.getElementById("url").value;
    const messageElement = document.getElementById("message");

    if (!url) {
        messageElement.textContent = "Please enter a URL!";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/sites/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, userType, addedBy, adminCode }),
        });

        const data = await response.json();
        if (data.success) {
            messageElement.textContent = "Site blocked successfully!";
            messageElement.style.color = "green";
            fetchBlockedSites(userType, adminCode);
        } else {
            messageElement.textContent = data.message;
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "Server error, please try again!";
        messageElement.style.color = "red";
    }
}

// 📌 Fetch blocked sites
async function fetchBlockedSites(userType, adminCode) {
    const blockedSitesList = document.getElementById("blockedSitesList");
    blockedSitesList.innerHTML = "<li>Loading...</li>";

    try {
        const response = await fetch(`http://localhost:5000/api/sites/list?userType=${userType}&adminCode=${adminCode || ""}`);
        const data = await response.json();

        if (data.success) {
            blockedSitesList.innerHTML = "";
            data.blockedSites.forEach((site) => {
                const listItem = document.createElement("li");
                listItem.textContent = site.url;
                blockedSitesList.appendChild(listItem);
            });
        } else {
            blockedSitesList.innerHTML = "<li>Error loading sites</li>";
        }
    } catch (error) {
        console.error("Error:", error);
        blockedSitesList.innerHTML = "<li>Server error!</li>";
    }
}
