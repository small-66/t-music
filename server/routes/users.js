var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register',function (req,res,next) {
  let id = Date.now().toString(16)+ Math.random().toString(16).substr(3)
  let param = {
    userId: id,
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  let user= new User(param)
  user.save(function (err) {
    console.log(err)
  })
})
router.post('/addAddress',function (req,res,next) {
  let userId= req.cookies.userId
  let addressId = Date.now().toString(16)
  let addList ={
    addressId:addressId,
    userName: req.body.userName,
    streetName: req.body.streetName,
    postCode: req.body.postCode,
    tel: req.body.tel
  }
  User.update({'userId':userId},{
    $push:{
      'addressList':addList
    }
    },function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

router.post('/login',function(req,res,next){
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param,function (err,userDoc) {
    if(err){
      res.json({
        status: '1',
        msg:err.message
      })
    }else{
      if(userDoc){
        /*存cookie及session*/
        res.cookie('userId',userDoc.userId,{
          path:'/',
          maxAge: 1000*60*60
        });
        res.cookie('userName',userDoc.userName,{
          path:'/',
          maxAge: 1000*60*60
        });
        /*req.session.user= userDoc;*/
        res.json({
          status: '0',
          msg:'',
          result: {
            userName: userDoc.userName
          }
        })
      }
    }
  })
});

router.post('/logout',function (req,res,next) {
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status: '0',
    msg:'',
    result:''
  })

});

router.get('/checkLogin',function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg:'',
      result:req.cookies.userName || ''
    })
  }else{
    res.json({
      status: '1',
      msg:'未登录',
      result:''
    })
  }
});
//查询当前用户的购物车数据
router.get('/cartList',function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status: '0',
          msg:'',
          result:doc.cartList
        })
      }else{

      }
    }
  })
});
//删除购物车数据
router.post('/cartDel',function (req,res,next) {
  var userId= req.cookies.userId,
    productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  });
});
//修改购物车
router.post('/cartEdit',function (req,res,next) {
  let userId= req.cookies.userId,
    productId = req.body.productId,
    checked= req.body.checked,
    productNum = req.body.productNum;
  User.update({'userId':userId,'cartList.productId':productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
});

router.post('/editCheckAll',function (req,res,next) {
  let userId= req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked= checkAll
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          }else{
            res.json({
              status: '0',
              msg: '',
              result:'suc'
            })
          }
        })
      }


    }
  })
});

router.get('/addressList',function (req,res,next) {
  let userId= req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
});
router.post('/setDefault',function (req,res,next) {
  let userId= req.cookies.userId,
    addressId= req.body.addressId;
  if(!addressId){
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    })
  }else{
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else{
        let addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId == addressId){
            item.isDefault = true
          }else{
            item.isDefault = false
          }
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
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
    })
  }

});
router.post('/delAddress',function (req,res,next) {
  let userId= req.cookies.userId,
    addressId= req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },function (err,doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
});
router.post('/payMent',function (req,res,next) {
  let userId= req.cookies.userId,
    addressId= req.body.addressId,
    orderTotal= req.body.orderTotal
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let address= ''
      doc.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address=item
        }
      })
      let goodsList=[]
      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item)
        }
      })
      var platform = '987'
      var r1 = Math.floor(Math.random()*10),
        r2 = Math.floor(Math.random()*10)
      var sysDate = new Date().Format('yyyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId =platform+r1+sysDate+r2
      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus: '1',
        createDate:createDate
      }
      doc.orderList.push(order)
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId: order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })

    }
  })

});
//根据订单id查询订单信息
router.get('/orderDetail',function (req,res,next) {
  let userId= req.cookies.userId,
    orderId= req.param('orderId')
  User.findOne({
    userId:userId
  },function (err,userInfo) {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result:''
      })
    }else {
      let orderList = userInfo.orderList
      if(orderList.length>0){
        let orderTotal = 0
        orderList.forEach((item)=>{
          if(item.orderId==orderId){
            orderTotal = item.orderTotal
          }
        })
        if(orderTotal>0){
          res.json({
            status: '0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status: '12002',
            msg:'无此订单',
            result:''
          })
        }

      }else {
        res.json({
          status: '12001',
          msg:'未有订单信息',
          result:''
        })
      }
    }
  })
})
module.exports = router;
