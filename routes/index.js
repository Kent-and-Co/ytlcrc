const express = require("express");

const router = express.Router();

const { getAccessToken } = require("../main/googleauth");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "YTLCRC 管理画面" });
});

router.get("/auth", (req, res, next) => {
  getAccessToken(req.query.code);
  res.redirect("/");
});

module.exports = router;
