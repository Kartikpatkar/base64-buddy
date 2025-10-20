// Optional: handle background tasks like downloads or notifications
chrome.runtime.onInstalled.addListener(() => {
    console.log("Base64 Buddy installed");
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('app/index.html') });
});
