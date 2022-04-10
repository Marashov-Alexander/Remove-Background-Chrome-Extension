const BASE_ENDPOINT = 'https://b7e5-31-134-188-214.ngrok.io';
let authorization = null

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "remove-background-app",
    title: "Remove background from image",
    contexts:["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (imageInfo) => {
  if (authorization === null) {
    await register()
  }
  return fetch(BASE_ENDPOINT + '/process-image', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authorization
    },
    body: JSON.stringify({
      imageUrl: imageInfo.srcUrl
    })
  })
  .then(rawResp => {
    return rawResp.json()
  })
  .then(respBody => {
    console.log(respBody);
    if (respBody?.imageUrl) {
      chrome.tabs.create({ url: BASE_ENDPOINT + '/get-image' 
        + '?imageName=' + respBody.imageUrl + '&authorization=' + authorization });
    }
  })
  .catch(err => {console.log(err)});
});

async function register() {
  const username = CreateUUID()
  const password = CreateUUID()
  return fetch(BASE_ENDPOINT + '/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
      .then(rawResp => {
          console.log(rawResp)
          authorization = btoa(username + ':' + password)
      })
      .catch(err => { console.log(err) });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: BASE_ENDPOINT + '/get-all-images' + '?authorization=' + authorization})
});

function CreateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
