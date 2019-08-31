const { app, BrowserWindow, ipcMain, shell } = require("electron");

/**
 * Module dependencies.
 */

const debug = require("debug")("ytlcrc:server");
const http = require("http");
const exapp = require("./app");

require("./main/store");
const {
  getAuthUrl,
  setCredentials,
  getAuthStatus
} = require("./main/googleauth");
const { getAllBroadcasts, getLiveChat } = require("./main/youtube");
const { sendStatusToWindow } = require("./common/common");

let mainWindow = null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  const loadURL = "http://localhost:3000/";
  if (global.store.get("credentials")) {
    setCredentials(global.store.get("credentials"));
  } else {
    const authUrl = getAuthUrl();
    shell.openExternal(authUrl);
  }
  const { width, height, x, y } = global.store.get("bounds");
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    webPreferences: { nodeIntegration: true }
  });

  ["resize", "move"].forEach(ev => {
    mainWindow.on(ev, () => {
      global.store.set("bounds", mainWindow.getBounds());
    });
  });

  mainWindow.loadURL(loadURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

/**
 * ipcMain関連
 * @type {[type]}
 */

ipcMain.on("getAuthStatus", event => {
  const response = getAuthStatus();
  event.returnValue = response;
});

ipcMain.on("getBroadcastData", async event => {
  const response = await getAllBroadcasts();
  event.returnValue = response;
});

ipcMain.on("getLiveChat", async (event, liveChatId) => {
  const response = await getLiveChat(liveChatId);
  event.returnValue = response;
});

/**
 * Create HTTP server.
 */

const server = http.createServer(exapp);

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
exapp.set("port", port);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      sendStatusToWindow(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      sendStatusToWindow(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
