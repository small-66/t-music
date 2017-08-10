var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var musics= require('./routes/musics');


var app = express();

// view engine setup 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//设置中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//登陆拦截 在路由请求之前进入下面的方法
app.use(function (req,res,next) {
  //获取cookie值
  if(req.cookies.userId){
    next();
  }else {
    if(req.originalUrl=='/musics' ||
      req.originalUrl=='/users/login' ||
      req.originalUrl=='/users/logout'||
      req.originalUrl=='/users/register'||

      req.originalUrl.indexOf('/goods/list')>-1
      /*req.path == '/goods/list'*/
    ){
      //白名单
      next()
    }else{
      res.json({
        status: '10001',
        msg: '当前未登陆',
        result: ''
      })
    }
  }
});
//设置路由
app.use('/', index);
app.use('/users', users);
app.use('/goods',goods);
app.use('/musics',musics);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler  catch 500
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
