// // When the extension is installed or upgraded ...
// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     // With a new rule ...
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         // That fires when a page's URL matches one of the following ...
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlMatches: 'https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO' }, // use https if necessary or add another line to match for both
//           })
//         ],
//         // And shows the extension's page action.
//         actions: [ new chrome.declarativeContent.ShowPageAction()]
//       }
//     ]);
//   });
// });

// chrome.pageAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(null, { file: "autoCopyCode.js" });
// });