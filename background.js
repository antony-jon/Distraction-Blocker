// import CONFIG from './config.js';
// const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; 


// chrome.alarms.create("keepAlive", { periodInMinutes: 4 });

// chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === "keepAlive") {
//         console.log("Keeping service worker alive...");
//     }
// });

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     if (message.type === "location") {
//         const location = message.data;
//         console.log("Received location:", location);

//         const atSchool = await isSchoolOrCollege(location.latitude,location.longitude);
//         console.log(`User at school/college: ${atSchool}`);

//         if (atSchool) {
//             const isDistracting = await isDistractingSite(sender.url);
//             console.log(`Is ${sender.url} distracting: ${isDistracting}`);

//             if (isDistracting) {
//                 console.log(`Blocking site: ${sender.url}`);
//                 injectCSSFile(sender.tab.id);
//                 console.log("Waiting for 3 seconds before closing the tab");
//                 setTimeout(() => {
//                     chrome.tabs.remove(sender.tab.id);
//                 }, 3000);
//             }
//         }
//     }
// });

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     if (message.type === "location") {
//         const location = message.data;
//         console.log("Received location:", location);

//         const atSchool = await isSchoolOrCollege(location);
//         console.log(`User at school/college: ${atSchool}`);

//         if (atSchool) {
//             const isDistracting = await isDistractingSite(sender.url);
//             console.log(`Is ${sender.url} distracting: ${isDistracting}`);

//             if (isDistracting) {
//                 console.log(`Blocking site: ${sender.url}`);
//                 chrome.tabs.remove(sender.tab.id);
//             }
//         }
//     }
// });

// async function isSchoolOrCollege(location) {
//     const query = `Given these coordinates: ${location.latitude}, ${location.longitude}, is there a school or college within radius of 1km ? Respond with "yes" or "no".`;

//     try {
//         const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
//         });

//         const data = await response.json();
//         const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
//         return answer === "yes";
//     } catch (error) {
//         console.error("Error checking school/college status:", error);
//         return false;
//     }
// }

// async function isDistractingSite(url) {
//     const query = `Is the following website unproductive for students in school or college? ${url}. Respond with "yes" or "no".`;

//     try {
//         const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
//         });

//         const data = await response.json();
//         const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
//         if (answer === "yes") {
//             console.log(`🚫 The site ${url} is UNPRODUCTIVE.`);
//         } else {
//             console.log(`✅ The site ${url} is PRODUCTIVE.`);
//         }
//         return answer === "yes";
//     } catch (error) {
//         console.error("Error checking site status:", error);
//         return false;
//     }
// }

// chrome.webNavigation.onCompleted.addListener(async (details) => {
//     console.log(`Checking site: ${details.url}`);

//     chrome.scripting.executeScript({
//         target: { tabId: details.tabId },
//         func: fetchLocation
//     });
// }, { url: [{ schemes: ["http", "https"] }] });

// function fetchLocation() {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             chrome.runtime.sendMessage({
//                 type: "location",
//                 data: { latitude: position.coords.latitude, longitude: position.coords.longitude }
//             });
//         },
//         (error) => console.error("Geolocation error:", error),
//         { enableHighAccuracy: true }
//     );
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message === "keep_alive") {
//         console.log("Received keep-alive message");
//         sendResponse({ status: "alive" });
//     }
// });
// function injectCSSFile(tabId) {
//     chrome.scripting.insertCSS({
//         target: { tabId: tabId },
//         files: ["css/blocked.css"]
//     });
// }

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
        return data.items.length > 0 ? true : false; 
    } catch (error) {
        console.error("Error:", error);
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
        
    } catch (error) {
        console.error("Error checking site status:", error);
        return false;
    }
}

let processedDomains = new Set();

chrome.webNavigation.onCompleted.addListener(async (details) => {
    const baseUrl = new URL(details.url).origin; // Extract base URL

    // Check if site is distracting
    const isDistracting = await isDistractingSite(details.url);

    if (isDistracting) {
        console.log(`Checking sub-URL: ${details.url} (unproductive site)`);
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchLocation
        });
    } else {
        if (!processedDomains.has(baseUrl)) {
            console.log(`Checking base URL: ${baseUrl} (productive site)`);
            processedDomains.add(baseUrl);
    const baseUrl = new URL(details.url).origin; // Extract base URL

    // Check if site is distracting
    const isDistracting = await isDistractingSite(details.url);

    if (isDistracting) {
        console.log(`Checking sub-URL: ${details.url} (unproductive site)`);
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchLocation
        });
    } else {
        if (!processedDomains.has(baseUrl)) {
            console.log(`Checking base URL: ${baseUrl} (productive site)`);
            processedDomains.add(baseUrl);

            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                func: fetchLocation
            });
        } else {
            console.log(`Skipping check for ${baseUrl}, already processed.`);
        }
    }
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                func: fetchLocation
            });
        } else {
            console.log(`Skipping check for ${baseUrl}, already processed.`);
        }
    }
}, { url: [{ schemes: ["http", "https"] }] });





function fetchLocation() {
    
    chrome.runtime.sendMessage({ type: "inject_css" });

    
    chrome.runtime.sendMessage({ type: "inject_css" });

    navigator.geolocation.getCurrentPosition(
        (position) => {
          
          
            chrome.runtime.sendMessage({
                type: "location",
                data: { latitude: position.coords.latitude, longitude: position.coords.longitude }
            });

            chrome.runtime.sendMessage({ type: "remove_css" });

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

