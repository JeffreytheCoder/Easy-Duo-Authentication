import { getQRLinkFromPage, fetchHOTPSecretFromDuo } from "./background.js";
import { Hotp } from "./jsOTP.js"; // used to generate HOTP passcodes (https://github.com/jiangts/JS-OTP)

chrome.storage.sync.get(null, function (data) {
    if (!data.HOTPSecret) {
        document.getElementById('scan').onclick = async function () {
            // Try to get the QR link from the current page
            document.getElementById('scan').innerText = 'Scanning! Please wait...'
            await getQRLinkFromPage()
                .then(async (QRLink) => {

                    // Try to fetch the HOTP secret from Duo
                    let [key, host] = QRLink.substring(QRLink.lastIndexOf('=') + 1).split('-');
                    host = atob(host);
                    await fetchHOTPSecretFromDuo(host, key)
                        .then((HOTPSecret) => {
                            chrome.storage.sync.set({ HOTPSecret });
                            document.getElementById('setUp').classList.add('hidden');
                            document.getElementById('setUpSuccess').classList.remove('hidden');
                        })
                        .catch((error) => {
                            console.log(error);
                            alert('Oops, something went wrong!\n\n'
                                + 'It seems like the QR code is no longer valid. Please retry the previous steps.');
                        });
                        
                })
                .catch((error) => {
                    console.log(error);
                    alert('No Duo QR code detected. Please try again.');
                });
            document.getElementById('scan').innerText = 'Scan QR Code';
        };
    }

    else {
        // Generate and display the next HOTP passcode
        document.getElementById('setUp').classList.add('hidden');
        document.getElementById('setUpSuccess').classList.add('hidden');
        document.getElementById('displayPasscode').classList.remove('hidden');

        function calculatePasscode() {
            let HOTP = new Hotp();
            return HOTP.getOtp(HOTPSecret, count);
        }

        document.getElementById('next').onclick = function () {
            count += 1;
            passcodes.push(calculatePasscode());
            document.getElementById('passcode').innerHTML = passcodes[count];
            chrome.storage.sync.set({ passcodes });
            chrome.storage.sync.set({ count });
        };

        document.getElementById('prev').onclick = function () {
            if (count <= 0) {
                alert("There is no previous passcode.");
                return;
            }
            count -= 1;
            passcodes.pop();
            document.getElementById('passcode').innerHTML = passcodes[count];
            chrome.storage.sync.set({ passcodes });
            chrome.storage.sync.set({ count });
        };

        document.getElementById('copy').onclick = function () {
            navigator.clipboard.writeText(passcodes[count]);
            document.getElementById('copy').innerHTML = 'Copied!';
        }

        let count = data.count;
        let passcodes = data.passcodes;
        let HOTPSecret = data.HOTPSecret;
        if (count === undefined) {
            count = -1;
            passcodes = [];
        }
        document.getElementById('next').click();
    }
});