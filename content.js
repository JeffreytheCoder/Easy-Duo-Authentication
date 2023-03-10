if (document.title.indexOf('Universal Prompt') != -1) {
  const input = document.getElementById('passcode-input');
  const button = document.getElementsByClassName('verify-button');

  chrome.storage.sync.get(null, function (data) {
    input.value = data.passcodes[data.count];
    document.getElementById('passcode-form').submit();
    button[0].click();
  });
}
