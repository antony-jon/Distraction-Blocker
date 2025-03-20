document.addEventListener("DOMContentLoaded", () => {
    const userType = localStorage.getItem("userType");
    const adminCode = localStorage.getItem("adminCode") ; // Ensure it's at least an empty string
    const userEmail = localStorage.getItem("userEmail"); // Use email instead of userId

    if (!userType || !userEmail) {
        console.log("Missing authentication details, redirecting...");
        window.location.href = "parentSignIn.html";
        return;
    }    

    document.getElementById("blockSiteButton").addEventListener("click", () => blockSite(userType, userEmail, adminCode));

    fetchBlockedSites(userType, adminCode);
});

async function blockSite(userType, addedBy, adminCode) {
    const url = document.getElementById("url").value.trim();
    const messageElement = document.getElementById("message");

    if (!url) {
        messageElement.textContent = "Please enter a URL!";
        messageElement.style.color = "red";
        return;
    }

    if (!addedBy) {
        console.error("User email (addedBy) is missing!");
        messageElement.textContent = "Error: Missing user information!";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/sites/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, userType, addedBy, adminCode }), // Using email as addedBy
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
        console.error("Error blocking site:", error);
        messageElement.textContent = "Server error, please try again!";
        messageElement.style.color = "red";
    }
}

// 📌 Fetch blocked sites
async function fetchBlockedSites(userType, adminCode) {
    const blockedSitesList = document.getElementById("blockedSitesList");
    blockedSitesList.innerHTML = "<li>Loading...</li>";

    try {
        const response = await fetch(`http://localhost:5000/api/sites/list?userType=${userType}&adminCode=${adminCode}`);
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
        console.error("Error fetching blocked sites:", error);
        blockedSitesList.innerHTML = "<li>Server error!</li>";
    }
}
