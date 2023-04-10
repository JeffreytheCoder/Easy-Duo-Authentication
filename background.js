export async function getQRLinkFromPage() {
    // Send request to the content script
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return await chrome.tabs.sendMessage(tab.id, { task: 'getQRLink' })
        .then((response) => response.QRLink);
}

// Fetch the HOTP secret from the Duo API
export async function fetchHOTPSecretFromDuo(host, key) {
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
        .then((res) => res.json())
        .then((data) => data.response.hotp_secret);
}