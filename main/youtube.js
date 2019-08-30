const { google } = require("googleapis");
const { shell } = require("electron");
const { getAuthUrl, oauth2Client, setCredentials } = require("./googleauth");
const { sendStatusToWindow } = require("../common/common");

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client
});

const getUpcomingBroadcasts = () =>
  new Promise((resolve, reject) => {
    if (global.store.get("credentials")) {
      setCredentials(global.store.get("credentials"));
    } else {
      const authUrl = getAuthUrl();
      shell.openExternal(authUrl);
    }
    youtube.liveBroadcasts
      .list({
        part: "id,snippet,status",
        broadcastStatus: "upcoming"
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

const getActiveBroadcasts = () =>
  new Promise((resolve, reject) => {
    if (global.store.get("credentials")) {
      setCredentials(global.store.get("credentials"));
    } else {
      const authUrl = getAuthUrl();
      shell.openExternal(authUrl);
    }
    youtube.liveBroadcasts
      .list({
        part: "id,snippet,status",
        broadcastStatus: "active"
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

const getAllBroadcasts = () =>
  Promise.all([getUpcomingBroadcasts(), getActiveBroadcasts()]).then(res => {
    const all = res[0].data.items.concat(res[1].data.items);
    return all;
  });

const getLiveChat = async liveChatId => {
  const response = await youtube.liveChatMessages
    .list({
      part: "snippet, authorDetails",
      liveChatId
    })
    .then(res => {
      return res;
    });
  return response;
};

module.exports = { getAllBroadcasts, getLiveChat };
