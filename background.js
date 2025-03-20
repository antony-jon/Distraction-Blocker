import CONFIG from './config.js';
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; 
const HEREPLACES_API_KEY=CONFIG.HEREPLACES_API_KEY;

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

async function isSchoolOrCollege(lat, lon, radius = 1000) {
    
    const url = `https://discover.search.hereapi.com/v1/discover?in=circle:${lat},${lon};r=${radius}&q=school,university&limit=1&apiKey=${HEREPLACES_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items.length > 0 ? true : false; 
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

async function isDistractingSite(url) {
    const query = `Is the following website is a social media or unproductive for students in school or college? ${url}. Respond with "yes" or "no".`;

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
        } else if(answer === "no"){
            console.log(`✅ The site ${url} is PRODUCTIVE.`);
        }
        return answer === "yes";
        // return true;
    } catch (error) {
        console.error("Error checking site status:", error);
        return false;
        // return true;
    }
}

let processedDomains = new Set();

chrome.webNavigation.onCompleted.addListener(async (details) => {
    const baseUrl = new URL(details.url).origin; // Extract base URL (e.g., "https://monkeytype.com")

    if (!processedDomains.has(baseUrl)) {
        console.log(`Checking site: ${baseUrl}`);
        processedDomains.add(baseUrl); // Mark as processed

        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchLocation
        });
    } else {
        console.log(`Already checked ${baseUrl}, skipping...`);
    }
}, { url: [{ schemes: ["http", "https"] }] });



function fetchLocation() {
    // Inject notification.css before requesting location
    chrome.runtime.sendMessage({ type: "inject_css" });

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Send location data
            chrome.runtime.sendMessage({
                type: "location",
                data: { latitude: position.coords.latitude, longitude: position.coords.longitude }
            });

            // Remove notification.css after getting location
            chrome.runtime.sendMessage({ type: "remove_css" });
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "inject_css") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.insertCSS({
                    target: { tabId: tabs[0].id },
                    files: ["css/location.css"]
                });
            }
        });
    } else if (message.type === "remove_css") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.removeCSS({
                    target: { tabId: tabs[0].id },
                    files: ["css/location.css"]
                });
            }
        });
    }
});


