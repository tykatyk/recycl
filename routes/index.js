import express from 'express'
const router = express.Router()
import serverRenderer from '../helpers/serverRenderer'
import Header from '../components/Header.jsx'
const {html, css} = serverRenderer(Header)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: "Home",
    header: html,
    css: css
  })
})

export default router
