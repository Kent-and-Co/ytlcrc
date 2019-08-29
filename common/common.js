const log = require('electron-log');

/**
 * sendStatusToWindow for display logs while dev
 * @param  {String} text text to show
 */

const sendStatusToWindow = (text) => {
  log.info(text);
};

module.exports = { sendStatusToWindow };
