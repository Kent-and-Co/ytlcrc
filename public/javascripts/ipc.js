const { ipcRenderer } = require("electron");

const getBroadcastData = () => {
  const res = ipcRenderer.sendSync("getBroadcastData");
  console.log(res);
  return res;
};
