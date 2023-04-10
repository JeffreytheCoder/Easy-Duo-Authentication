// Listen for requests from the background script
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.task === "getQRLink") {
            sendResponse({ QRLink: getQRLink() });
        } 
    }
);

// Get the QR link from the DOM
function getQRLink() {
    let QRImg = document.getElementsByClassName('qr')[0]; // Traditional Prompt
    QRImg = (QRImg) ? QRImg : document.querySelector('[data-testid=qr-code]'); // Universal Prompt
    return (QRImg) ? QRImg.src : null;
}

if (document.title.indexOf('Universal Prompt') != -1) {
  const input = document.getElementById('passcode-input');
  const button = document.getElementsByClassName('verify-button');

  chrome.storage.sync.get(null, function (data) {
    input.value = data.passcodes[data.count];
    document.getElementById('passcode-form').submit();
    button[0].click();
  });
}