const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

require('../main/store');
const { sendStatusToWindow } = require('../common/common');

const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'client_secret.json')));

const SCOPE = ['https://www.googleapis.com/auth/youtube']; // APIで操作するスコープを配列形式で指定する。今回はWebマスターツールを操作するので、https://www.googleapis.com/auth/webmastersと指定。詳しくは後述
const oauth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  'http://localhost:3000/auth',
);

/**
 * OAuth2認証のためのURLを生成する
 * @return {String} URL
 */
const getAuthUrl = () => {
  // OAuth2認証のためのURLを生成する
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // refresh_tokenが必要なので、offlineを指定
    scope: SCOPE,
  });
  return url;
};

/**
 * 認証コードからtokenを取得する
 * @param  {String} code 認証コード
 */
const getAccessToken = (code) => {
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      sendStatusToWindow(err);
      global.store.delete('credentials');
    }
    sendStatusToWindow(tokens);
    global.store.set('credentials', tokens);
  });
};

/**
 * oauth2Clientにtokenのセットをする
 * @param {Object} tokens object of tokens
 */

const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

module.exports = {
  getAuthUrl,
  getAccessToken,
  setCredentials,
  oauth2Client,
};
