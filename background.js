const loginUrl = 'https://google.com';

chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    console.log(tab.url);
    console.log(loginUrl);
    if (tab.url == loginUrl) {
      // do something here
      chrome.tabs.sendMessage( tabId, {
        message: 'login'
      })
    }
  }
);