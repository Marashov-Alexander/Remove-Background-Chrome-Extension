const BASE_ENDPOINT = 'https://b9a4-95-55-86-98.ngrok.io';
let username;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "remove-background-app",
    title: "Remove background from image",
    contexts:["image"]
  });
});

chrome.identity.getProfileUserInfo((userInfo) => {
  username = 
    userInfo.email 
      || ('unauthorized' + String(Math.random()).split('.')[1]);
});

chrome.contextMenus.onClicked.addListener(async (imageInfo) => {
  return fetch(BASE_ENDPOINT + '/process-image', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      imageUrl: imageInfo.srcUrl
    })
  })
  .then(rawResp => {
    return rawResp.json()
  })
  .then(respBody => {
    if (respBody?.imageUrl) {
      chrome.tabs.create({ url: BASE_ENDPOINT + '/get-image' 
        + '?imageName=' + respBody.imageUrl });
    } else {
      console.log(respBody?.message);
    }
  })
  .catch(err => {});
});