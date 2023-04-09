export async function fetchHOTPSecretFromDuo(link) {
    let host = 'api' + link.substring(link.indexOf('-'), link.indexOf('com') + 3);
    let key = link.substring(link.lastIndexOf('/') + 1);
    let duoURL = 'https://' + host + '/push/v2/activation/' + key + '?customer_protocol=1';
    return await fetch(duoURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'jailbroken': 'false',
            'architecture': 'arm64',
            'region': 'US',
            'app_id': 'com.duosecurity.duomobile',
            'full_disk_encryption': 'true',
            'passcode_status': 'true',
            'platform': 'Android',
            'app_version': '3.49.0',
            'app_build_number': '323001',
            'version': '11',
            'manufacturer': 'unknown',
            'language': 'en',
            'model': 'Easy Duo Authentication',
            'security_patch_level': '2021-02-01'
        })
    })
        // On success
        .then(async (response) => {
            let data = await response.json();
            let HOTPSecret = data.response.hotp_secret;
            chrome.storage.sync.set({ HOTPSecret });
        })
        // On failure
        .catch((error) => {
            return error;
        });
}