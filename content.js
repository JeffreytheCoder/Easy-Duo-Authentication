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
    if (!QRImg) {
        QRImg = document.querySelector('[data-testid=qr-code]'); // Universal Prompt
    }
    return QRImg.src;
}