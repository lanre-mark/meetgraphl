var express = require('express');
var path = require('path');
const fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
const mongoose = require('mongoose');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

try {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PWD}${process.env.MONGODB_HOST_NAME}${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((con) => console.log('Connected to DB'));
} catch (e) {
  console.log('Failed to connect to database: ', e);
}

const index = require('./routes/index');

const grafikApp = express();

grafikApp.use(bodyParser.urlencoded({ extended: true }));
grafikApp.use(bodyParser.json());

grafikApp.use(logger('dev'));
grafikApp.use(useragent.express());

grafikApp.use(express.static('public'));

// Enable CORS from client-side
grafikApp.use(function(req, res, next) {
  if (req.headers.origin != undefined) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-auth, x-version, x-route'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// // catch 404 and forward to error handler
// grafikApp.use(function(req, res, next) {
//     var err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

// error handler
grafikApp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // NO ERROR PAGE created for this yet
  res.status(err.status || 500);
});

grafikApp.use('/', index);

grafikApp.get('/', function(req, res, next) {
  res.sendFile(`${__dirname}/views/index.html`);
});

module.exports = grafikApp;
