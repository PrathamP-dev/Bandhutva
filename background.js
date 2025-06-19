chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.includes("linkedin.com/mynetwork")) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["content.js"]
    });
  }
});
