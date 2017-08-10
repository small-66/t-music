var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Musics = require('../models/music');
/*连接mongodb数据库*/
mongoose.connect('mongodb://127.0.0.1:27017/tmusic');
//设置监听(成功、失败、断开)
mongoose.connection.on('connected',function () {
  console.log("mongodb connected success")
});
mongoose.connection.on('error',function () {
  console.log("mongodb connected fail")
});
mongoose.connection.on('disconnected',function () {
  console.log("mongodb connected disconnected")
});

router.get('/',function(req,res,next){
  Musics.find({},function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else{
      res.json({
        status: '0',
        msg:'',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }

  })
});
module.exports = router;
