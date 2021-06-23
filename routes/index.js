require("@babel/register")
const express = require('express')
const router = express.Router()
const {css, html} = require('../public/ssr/home.mjs')

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('home', {
    header: html,
    css: css,
  });
});

module.exports = router;
