import express from 'express'
import serverRenderer from '../helpers/serverRenderer'
import Home from '../components/Home.jsx'
import HandOverClaim from '../components/HandOverClaim.jsx'

const router = express.Router()

/* GET page to show claims for waste removal */
router.get('/removal', (req, res, next) => {
  console.log('ok')
  const { html, css } = serverRenderer(HandOverClaim, req)
  res.render('home', {
    title: 'Waste Removal',
    content: html,
    css
  })
})

/* GET home page. */
router.get('/', (req, res, next) => {
  const { html, css } = serverRenderer(Home, req)

  res.render('home', {
    title: 'Home',
    content: html,
    css
  })
})

export default router
