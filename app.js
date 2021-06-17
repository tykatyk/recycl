const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const handlebars = require('express-handlebars')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.engine('handlebars', handlebars({
  layoutsDir: path.join(__dirname, '/public/views/layouts')
}))
app.set('views', path.join(__dirname, '/public/views'))
app.set('view engine', 'handlebars')
app.set('view options', { layout: 'main' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
