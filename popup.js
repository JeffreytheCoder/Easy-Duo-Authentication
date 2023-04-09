import { fetchHOTPSecretFromDuo } from "./background.js";
import { Hotp } from "./jsOTP.js";

chrome.storage.sync.get(null, function (data) {
    let HOTPSecret = data.HOTPSecret;
    if (HOTPSecret == undefined) {
        // When the user submits an activation link, try to fetch the HOTP secret from Duo
        document.getElementById('submit').onclick = async function () {
            let link = document.getElementById('link').value;
            document.getElementById('submit').innerText = 'Activating! Please wait...'
            let error = await fetchHOTPSecretFromDuo(link);
            // On Success
            if (!error) {
                document.getElementById('setUp').classList.add('hidden');
                document.getElementById('setUpSuccess').classList.remove('hidden');
            }
            // On failure
            else {
                alert('Oops, something went wrong!\n\n'
                    + 'It seems like the activation link is no longer valid. Please retry the previous steps.');
                console.log(error);
            }
            document.getElementById('submit').innerText = "Submit"
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
            passcodes.push(calculatePasscode(count));
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
        HOTPSecret = data.HOTPSecret;
        if (count == undefined) {
            count = -1;
            passcodes = [];
        }
        document.getElementById('next').click();
    }
});