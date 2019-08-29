const express = require('express');

const router = express.Router();

const { getAccessToken } = require('../main/googleauth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/auth', (req, res, next) => {
  getAccessToken(req.query.code);
  res.render('index', { title: 'auth' });
});

module.exports = router;
