document.getElementById("checkSite").addEventListener("click", async () => {
    document.getElementById("status").textContent = "Checking website...";

    // Get active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length === 0) return;

        const url = tabs[0].url;
        console.log(`Checking: ${url}`);

        const isUnsafe = await isWebsiteUnsafe(url);
        document.getElementById("status").textContent = isUnsafe ? "❌ This site is unsafe!" : "✅ This site is safe!";
    });
});

// Check if a website is unsafe using Gemini API
async function isWebsiteUnsafe(url) {
    const GEMINI_API_KEY = "AIzaSyA9A-MptqoBap5_R83_phRiDLtfUjB4UXw";
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
