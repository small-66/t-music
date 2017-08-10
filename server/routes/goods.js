var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
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
//查询商品列表
router.get('/list', function(req, res, next) {
  //req.param()获取浏览器信息
  let page = parseInt(req.param("page"));//获取页数
  let pageSize = parseInt(req.param("pageSize"));//一页有多少数据
  let sort = req.param("sort");//排序
  let priceLev = req.param("priceLev");
  let skip = (page-1)*pageSize;//默认跳过几条数据
  let params= {};
  let priceGt ='',priceLte='';
  if(priceLev!='all'){
    switch (priceLev){
      case '0': priceGt =0;priceLte=100;break;
      case '1': priceGt =100;priceLte=500;break;
      case '2': priceGt =500;priceLte=1000;break;
      case '3': priceGt =1000;priceLte=10000;break;
      default:  priceGt =0;priceLte=10000;break;
    }
    params = {
      salePrice:{
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  //分页
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
  });
//加入的购物车
router.post("/addCart",function (req,res,next) {
  var userId = req.cookies.userId;
  var User = require('../models/user');
  //post 方式取参，req.body.
  var productId = req.body.productId;
  User.findOne({
    userId:userId
  },function (err,userDoc) {
    if(err){
      res.json({
        status:'1',
        msg: err.message
      })
    }else{
      if(userDoc){
        let goodsItem='';
        console.log(userDoc)
        userDoc.cartList.forEach((item)=>{
          if(item.productId==productId){
            goodsItem= item;
            item.productNum++;
          }
        })
        console.log(goodsItem)
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:'1',
                msg: err2.message
              })
            }else{
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},function (err1,doc1) {
            if(err1){
              res.json({
                status:'1',
                msg: err1.message
              })
            }else {
              if(doc1){
                doc1._doc.productNum =1;
                doc1._doc.checked= 1;
                //向数据库中插入数据，直接找到要加入的数据列表push进去
                userDoc.cartList.push(doc1);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg: err2.message
                    })
                  }else{
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

//输出
module.exports = router;
