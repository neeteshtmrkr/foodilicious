var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore=require('session-file-store')(session);
var passport = require('passport');
var authenticate=require('./authenticate');
var config =require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');

//not connected to backend mongodb server, so to establish the connection
const mongoose=require('mongoose');

//import dishes
const Dishes=require('./modals/dishes');
const { db } = require('./modals/dishes');
//establish connection with server
const url=config.mongoUrl;
const connect=mongoose.connect(url,{
  useMongoClient:true
});

connect.then((db)=>{
  console.log('Connection to the server successful!!');
},(err)=>{console.log(err);});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//=============Removing Authentication completely===============
//first need to authorize
// function auth(req,res,next){
//   console.log(req.session);
//   if(!req.user){
//   // console.log(req.headers);

//   // var authHeader=req.headers.authorization;
  
//   // if(!authHeader){
//     var err = new Error('You are not authenticated!!');
//     err.status=403;
//     return next(err);
//   }

//   // var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

//   // var username=auth[0];
//   // var password=auth[1];

//   // if(username==='admin'&& password==="password"){
//   //   res.session.user='admin';
//   //   next();
//   // }
//   // else{
//   //   var err = new Error('You are not authenticated!!');

//   //   res.setHeader('WWW-Authenticate','Basic');
//   //   err.status=401;
//   //   return next(err);
//   // }
//   // }//if part closes here
//   else{
//   // if user exists then signed cookie already exists which is solved by this else part
//       next();
//   } 
// }//function auth closes here

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
