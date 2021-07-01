import express from 'express'
const router = express.Router()
import serverRenderer from '../helpers/serverRenderer'
import Home from '../components/Home.jsx'
const {html, css} = serverRenderer(Home)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: "Home",
    content: html,
    css: css
  })
})

export default router
