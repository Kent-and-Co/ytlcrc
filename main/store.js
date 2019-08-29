const Store = require('electron-store');

/**
 * setup defalut config
 */
global.store = new Store({
  defaults: {
    bounds: {
      width: 800,
      height: 600,
    },
  },
});
