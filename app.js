var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var hbs = require('express-handlebars')

var app = express();
var fileupload = require('express-fileupload') // to upload files in form
var db = require('./config/connection')   // to start connection with server we need to import the module to app,js (6)
var session = require('express-session')  // session npm 

// view engine setup  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials' }))
// here set path to new hbs folders and files

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload())  // here we use file upload  that imported  
app.use(session({ secret: "Key", cookie: { maxAge: 6000000 } })) // session use
db.connect((err) => {   // when app start , first we need to connect with db (6)
  if (err) console.log("Connection error" + err); 
  else console.log("Data-base connected to port 27017");
})    // to print connection status in console .log 



app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
 