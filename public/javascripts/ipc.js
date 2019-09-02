/* eslint no-unused-vars: 0 */
const { ipcRenderer } = require("electron");

const getAuthStatus = () => {
  const res = ipcRenderer.sendSync("getAuthStatus");
  return res;
};

const getBroadcastData = () => {
  const res = ipcRenderer.sendSync("getBroadcastData");
  return res;
};

const getLiveChat = async args => {
  const res = await ipcRenderer.sendSync("getLiveChat", args);
  return res;
};
