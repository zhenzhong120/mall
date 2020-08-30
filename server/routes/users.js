var express = require('express');
var router = express.Router();
require("./../util/date.js");
var User = require("./../models/user"); //获取user模型
const user = require('./../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get("/test", function (req, res, next) {
  res.send("test");
})

//登录接口
router.post("/login", function (req, res, next) {
  let param = { //取前端传来的参数，参数都在request请求中，post提交通过req.body取参
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function (err, doc) { //查找条件；报错状态，集合信息doc;
    if (err) { //err存在说明报错,在response中写入一个json文件
      res.json({
        status: "1",
        msg: err.message //err.message报错信息，msg是封装的，报错后会将它显示出来

      });
    } else {
      if (doc) {
        //将用户信息同时存入cookie（res）和 session（req）
        res.cookie("userId", doc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        // req.session.user = doc;
        res.json({ //如果存在用户信息，则在相应文件response中写入json,前端才能拿到
          status: "0", //相应数据response文件中返回给前端的字段要固定：status/msg/result
          msg: "",
          result: {
            userName: doc.userName //返回数据库中的用户名，展现
          }
        })
      }
    }
  })
})

//登出接口
router.post("/logout", function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: "0",
    msg: "",
    result: ""
  })

})

//查询购物车数量接口
router.get("/getCartCount", function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ""
        })
      }else{
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        })
      }
    })
  }
})
//登录校验
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {  //登录的状态
    res.json({
      status: "0",
      msg: "",
      result: req.cookies.userName //从cookie中提取用户名
    })
  } else {   //未登录的状态
    res.json({
      status: "1",
      msg: "未登录",
      result: ""
    })
  }
})
//查询当前用户的购物车数据 
//先拿到用户的cookie，app.js已做登录全局拦截，直接取用户id
router.get("/cartList", function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""

      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.cartList,//拿到购物车列表数据

        })
      }
    }
  })
})
//购物车删除功能
router.post("/cartDel", function (req, res, next) {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.update({ userId: userId }, {
    $pull: {
      "cartList": {
        "productId": productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: "suc"
      })
    }
  });
})

//购物车商品数量修改功能
router.post("/cartEdit", function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({ "userId": userId, "cartList.productId": productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,

  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: "suc"
      })
    }
  })
})

//购物车修改
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId;
  checkAlls = req.body.checkAll ? '1' : '0';

  User.findOne({ userId: userId }, function (err, user) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAlls;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: "1",
              msg: err.message,
              result: ""
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: "suc"
            })
          }
        })
      }

    }
  })
})

//查询用户地址接口
router.get("/addressList", function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: doc.addressList
      })
    }
  })
})

//设置默认地址接口
router.post("/setDefault", function (req, res, next) {
  var userId = req.cookies.userId;
  addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: "1003",
      msg: "addressId is null",
      result: ""
    })
  } else {
    User.findOne({ userId: userId }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ""
        })
      } else {
        var addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;

          } else {
            item.isDefault = false;
          }
        });
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
              result: ""
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: ""
            })
          }
        })
      }
    })
  }
})

//删除用户信息地址接口
router.post("/delAddress", function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({
    userId: userId
  }, {
    $pull: {
      "addressList": {
        "addressId": addressId
      }
    }
  },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ""
        })
      } else {
        res.json({
          status: "0",
          msg: "",
          result: ""
        })
      }
    })
})

//订单生成接口
router.post("/payMent", function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;

  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: "",
        result: ""
      })
    } else {
      var address = "", goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })

      //获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked == "1") {
          goodsList.push(item);
        }
      })

      //  平台架构系统码，系统平台数字，比如622代表当前平台架构系统   
      var platform = "626";
      //Math.random() 随机数0-1，  *10为0-10的随机数  Math.floor=>0-9的随机数
      //两个随机数
      var rl = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      //调用date.js中在date身上调动的Format方法，生成系统时间
      var sysDate = new Date().Format("yyyyMMddhhmmss");
      //订单创建时间
      var createDate = new Date().Format("yyyy-MM-dd hh:mm:sss");
      var orderId = platform + rl + sysDate + r2; //用随机数拼接放置相同
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        adressInfo: address,
        goodsList: goodsList,
        orderStatus: "1",
        createDate: createDate
      };
      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: "",
            result: ""
          })
        } else {
          res.json({
            status: "0",
            msg: "",
            result: {
              orderId: order.orderId,
              orderTotal: order.orderToal
            }
          })
        }
      })

    }

  })
})

//根据订单id查询订单信息
router.get("/orderDetail", function (req, res, next) {
  var userId = req.cookies.userId,
    orderId = req.param("orderId"); //前端query
  User.findOne({ userId: userId }, function (err, userInfo) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      var orderList = userInfo.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach((item) => {
          console.log(item.orderId, orderId);
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });

        //订单总额是0，假设没有订单
        if (orderTotal > 0) {
          res.json({
            status: "0",
            msg: "",
            result: {
              orderId: orderId,
              orderTotal: orderTotal

            }
          })
        } else {
          res.json({
            status: "12002",
            msg: "无此订单，未查到",
            result: ""
          })
        }

      } else {
        res.json({
          status: "12001",
          msg: "当前用户未创建订单",
          result: ""
        })
      }
    }
  })
})
module.exports = router;
