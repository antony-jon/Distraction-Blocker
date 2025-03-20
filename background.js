import CONFIG from './config.js';
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; 


chrome.alarms.create("keepAlive", { periodInMinutes: 4 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Keeping service worker alive...");
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "location") {
        const location = message.data;
        console.log("Received location:", location);

        const atSchool = await isSchoolOrCollege(location.latitude,location.longitude);
        console.log(`User at school/college: ${atSchool}`);

        if (atSchool) {
            const isDistracting = await isDistractingSite(sender.url);
            console.log(`Is ${sender.url} distracting: ${isDistracting}`);

            if (isDistracting) {
                console.log(`Blocking site: ${sender.url}`);
                injectCSSFile(sender.tab.id);
                console.log("Waiting for 3 seconds before closing the tab");
                setTimeout(() => {
                    chrome.tabs.remove(sender.tab.id);
                }, 3000);
            }
        }
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "location") {
        const location = message.data;
        console.log("Received location:", location);

        const atSchool = await isSchoolOrCollege(location);
        console.log(`User at school/college: ${atSchool}`);

        if (atSchool) {
            const isDistracting = await isDistractingSite(sender.url);
            console.log(`Is ${sender.url} distracting: ${isDistracting}`);

            if (isDistracting) {
                console.log(`Blocking site: ${sender.url}`);
                chrome.tabs.remove(sender.tab.id);
            }
        }
    }
});

async function isSchoolOrCollege(location) {
    const query = `Given these coordinates: ${location.latitude}, ${location.longitude}, is there a school or college within radius of 1km ? Respond with "yes" or "no".`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
        });

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
        return answer === "yes";
    } catch (error) {
        console.error("Error checking school/college status:", error);
        return false;
    }
}

async function isDistractingSite(url) {
    const query = `Is the following website unproductive for students in school or college? ${url}. Respond with "yes" or "no".`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
        });

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
        if (answer === "yes") {
            console.log(`🚫 The site ${url} is UNPRODUCTIVE.`);
        } else {
            console.log(`✅ The site ${url} is PRODUCTIVE.`);
        }
        return answer === "yes";
    } catch (error) {
        console.error("Error checking site status:", error);
        return false;
    }
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
    console.log(`Checking site: ${details.url}`);

    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: fetchLocation
    });
}, { url: [{ schemes: ["http", "https"] }] });

function fetchLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            chrome.runtime.sendMessage({
                type: "location",
                data: { latitude: position.coords.latitude, longitude: position.coords.longitude }
            });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "keep_alive") {
        console.log("Received keep-alive message");
        sendResponse({ status: "alive" });
    }
});
function injectCSSFile(tabId) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["css/blocked.css"]
    });
}