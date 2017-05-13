const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');


const app = express();

// engine setup
app.set('views', path.join(__dirname, 'views')); // folder for pug files
app.set('view engine', 'pug'); // use the engine pug

// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// take in raw requests and turn them into usable props on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// expose methods for validating data
app.use(expressValidator());

// grab cookies that came with the request
app.use(cookieParser());

// Sessions to store data on visitors from request to request
// Keep users logged and send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// // Passport JS to handle login
app.use(passport.initialize());
app.use(passport.session());


// flash middleware for passings errors to the user
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// handle routes
app.use('/', routes);

// 404 and forward error
app.use(errorHandlers.notFound);


// check if any error(s) are validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise bad error. not expected!
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
