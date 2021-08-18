import express from 'express'
import serverRenderer from '../helpers/serverRenderer'
import Home from '../../src/components/Home.jsx'
import HandOverClaim from '../../src/components/HandOverClaim.jsx'

const router = express.Router()

/* GET page to show claims for waste removal */
router.get('/removal', (req, res, next) => {
  console.log('ok')
  const { html, css } = serverRenderer(HandOverClaim, req)
  res.render('index', {
    title: 'Waste Removal',
    content: html,
    css
  })
})

/* GET home page. */
router.get('/', (req, res, next) => {
  const { html, css } = serverRenderer(Home, req)

  res.render('index', {
    title: 'Home',
    content: html,
    css,
    br: process.env.BROWSER_REFRESH_URL
  })
})

export default router
