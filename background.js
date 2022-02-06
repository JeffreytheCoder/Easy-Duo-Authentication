const loginUrl =
  'https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status &&
    changeInfo.status == 'complete' &&
    tab.url.includes(loginUrl)
  ) {
    chrome.tabs.executeScript(null, { file: 'autoCopyCode.js' });
  }
});
