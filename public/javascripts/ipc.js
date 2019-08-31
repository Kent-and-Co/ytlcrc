const { ipcRenderer } = require("electron");

const getAuthStatus = () => {
  const res = ipcRenderer.sendSync("getAuthStatus");
  return res;
}

const getBroadcastData = () => {
  const res = ipcRenderer.sendSync("getBroadcastData");
  return res;
};

const getLiveChat = async liveChatId => {
  const res = await ipcRenderer.sendSync("getLiveChat", liveChatId);
  return res;
};
