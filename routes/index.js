const express = require('express');
const router = express.Router();
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const Home = React.createFactory(require('../components/home.jsx'))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    content: ReactDOMServer.renderToString(Home())
  });
});

module.exports = router;
