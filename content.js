chrome.storage.local.get("blockedSites", ({ blockedSites }) => {
    const currentUrl = window.location.hostname;
    if (blockedSites && blockedSites.includes(currentUrl)) {
        document.body.innerHTML = `<h1 style='color: red; text-align: center;'>This site is blocked!</h1>`;
    }
});