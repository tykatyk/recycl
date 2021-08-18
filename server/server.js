import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
// import webpack from 'webpack'
// import webpackDevMiddleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../webpack.config'
import indexRouter from './routes/index'

// const compiler = webpack(config)
//
const app = express()
const port = 3000

app.set('views', path.join(__dirname, '../../server/views'))
app.set('view engine', 'html')
app.engine('html', require('hbs').__express)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
/* app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
)
app.use(webpackHotMiddleware(compiler)) */
// app.use(express.static(path.join(__dirname, 'build', 'client')))
app.use(express.static(path.join(__dirname, '../client')))

//
app.use(indexRouter)
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  /* if (process.send) {
    process.send('online')
  } */
})
if (process.send) {
  process.send({ event: 'online', url: 'http://localhost:3000/' })
}
