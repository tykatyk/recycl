import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import sassMiddleware from 'node-sass-middleware'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config'
import indexRouter from './routes/index'

const compiler = webpack(config)

const app = express()
const port = 3000

app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
)
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
)
app.use(webpackHotMiddleware(compiler))
app.use(express.static(path.join(__dirname, 'build', 'public')))

app.use(indexRouter)
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
