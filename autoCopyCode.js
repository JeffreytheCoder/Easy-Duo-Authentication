function copyCode() {
  chrome.storage.sync.get(null, function (data) {
    let HOTPSecret = data.HOTPSecret;
    let count = data.count;
    let passcodes = data.passcodes;
    if (count == undefined) {
      count = -1;
      passcodes = [];
    }

    function calculatePasscode() {
      count += 1;
      let HOTP = new jsOTP.hotp();
      let passcode = HOTP.getOtp(HOTPSecret, count);
      passcodes.push(passcode);
      chrome.storage.sync.set({ passcodes });
      chrome.storage.sync.set({ count });
      return passcode;
    }

    const iframe = document.getElementById('duo_iframe');
    const codeInput =
      iframe.contentWindow.document.getElementsByClassName('passcode-input')[0];
    const enterBtn = iframe.contentWindow.document.getElementById('passcode');

    if (codeInput) {
      codeInput.innerHTML = calculatePasscode();
      if (enterBtn) {
        enterBtn.click();
      } else {
        alert('passcode button not found');
      }
    } else {
      alert('passcode-input not found');
    }
  });
}

const checkIframe = () => {
  const interval = setInterval(() => {
    const iframe = document.getElementById('duo_iframe');
    console.log(iframe);
    if (iframe) {
      clearInterval(interval);
      copyCode();
    }
  }, 1000);
};
checkIframe();
