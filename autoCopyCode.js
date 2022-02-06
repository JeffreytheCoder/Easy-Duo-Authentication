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
  return passcode
}

const codeInput = document.getElementsByClassName('passcode-input')[0];
const enterBtn = document.getElementById('passcode');

if (codeInput) {
  codeInput.innerHTML = calculatePasscode();
  if (enterBtn) {
    enterBtn.click();
  } else {
    console.log('passcode button not found')
  }
} else {
  console.log('passcode-input not found');
}
