module.exports = {
  plugins: ["stylelint-order", "stylelint-scss"],
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/node_modules/**"],
  rules: {
    // scssを使うには↓の2つがないと@mixinとかでエラーになってしまう。
    "at-rule-no-unknown": null,
    //"scss/at-rule-no-unknown": true,
    // ...
    "order/properties-alphabetical-order": true,
    "string-quotes": "single"
  }
};
