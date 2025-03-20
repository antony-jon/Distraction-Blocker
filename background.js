import CONFIG from './config.js';
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Keep Service Worker Alive
chrome.alarms.create("keepAlive", { periodInMinutes: 0.066 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Service worker is alive...");
    }
});

// Monitor website visits, but only when blocking is enabled
chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (!details.url.startsWith("http")) return; // Ignore non-HTTP(S) requests

    // Check if blocking is enabled before proceeding
    chrome.storage.local.get("blockingEnabled", async (data) => {
        if (!data.blockingEnabled) {
            console.log("Blocking is OFF. Skipping check for:", details.url);
            return; // Exit if blocking is disabled
        }

        console.log(`Checking site: ${details.url}`);

        try {
            const isUnsafe = await isWebsiteUnsafe(details.url);
            console.log(`URL: ${details.url} | Safe? ${!isUnsafe}`);

            if (isUnsafe) {
                console.log(`Blocking: ${details.url}`);

                // Inject warning message before closing
                injectBlockedMessage(details.tabId);

                console.log("Waiting for 3 seconds before closing the tab");
                setTimeout(() => {
                    chrome.tabs.remove(details.tabId);
                }, 3000);
            }
        } catch (error) {
            console.error("Error in processing URL:", error);
        }
    });

}, { url: [{ schemes: ["http", "https"] }] });

// Check if a website is unsafe using Gemini API
async function isWebsiteUnsafe(url) {
    const query = `Is the following website unsafe for users under 17? ${url}. Respond with "yes" or "no".`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
        });

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

        console.log(`API Response for ${url}: ${answer}`);
        return answer === "yes"; // If "yes", the site is unsafe
    } catch (error) {
        console.error("Error checking site status:", error);
        return false;
    }
}

// Show "Blocked" message before closing the tab
function injectBlockedMessage(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
            document.body.innerHTML = `
                <div class="blocked-message">
                    <h1>!! YOU ARE NOT SUPPOSED TO ACCESS IT !!</h1>
                    <p>Redirecting in <span id="timer">3</span> seconds...</p>
                </div>
                <script>
                    let count = 3;
                    const timerElement = document.getElementById("timer");
                    const interval = setInterval(() => {
                        count--;
                        timerElement.textContent = count;
                        if (count === 0) clearInterval(interval);
                    }, 1000);
                </script>
            `;
        }
    });

    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["css/blocked.css"]
    });
}
