const { ipcRenderer } = require("electron");

const getBroadcastData = () => {
  const res = ipcRenderer.sendSync("getBroadcastData");
  return res;
};

const getLiveChat = async liveChatId => {
  const res = await ipcRenderer.sendSync("getLiveChat", liveChatId);
  return res;
};
