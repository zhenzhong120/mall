var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require("../models/goods");

//连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/dumall");
//监听数据库是否连接成功
mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
})
mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
})
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconne.")
})

//查询goods路由-二级路由 查询商品列表数据
router.get("/list", function (req, res, next) {
    let page = parseInt(req.param("page")); //拿去前端参数
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param("priceLevel"); //后台接口接收前端请求传递的这个参数
    let sort = req.param("sort"); //前端传递的参数

    let skip = (page - 1) * pageSize;
    //价格查询
    var priceGt = "", priceLte = "";
    let params = {};

    if (priceLevel != "all") {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 500; break;
            case '1': priceGt = 600; priceLte = 1000; break;
            case '2': priceGt = 1100; priceLte = 1500; break;
            case '3': priceGt = 1600; priceLte = 2000; break;
        }
        params = {
            productPrice: { //条件查询
                $gte: priceGt, //>=
                $lte: priceLte //<=
            }
        }
    }
    //分页
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize); //find返回的是对象，调用sort方法
    goodsModel.sort({ "productPrice": sort }) //MongoDB实现的API 升序降序
    // res.send('hello,goods list .')
    //查询MongoDB数据库，拿到Goods模型，通过model的模型
    //model模型提供了一个findAPI，第一个参数是查询条件， 第二个参数是回调函数，回调函数的第一个参数是报错，第二个参数是文档
    goodsModel.exec(function (err, doc) { //doc是列表查出来的集合
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            });
        } else {
            res.json({
                status: "0",
                msg: "",
                result: {
                    count: doc.length, //doc是列表查出来的集合
                    list: doc
                }
            })
        }
    })
})
//加入到购物车,提交用post，相对安全,查询用get
router.post("/addCart", function (req, res, next) {
    // 假设用户已经登录 ,拿到用户信息，引入模型，
    var userId = "100000077", productId = req.body.productId;
    var User = require("../models/user");
    User.findOne({ userId: userId }, function (err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            console.log("userDoc" + userDoc);
            if (userDoc) {
                let goodsItem = "";
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save(function (err2) { //保存到MongoDB数据库
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: "0",
                                msg: "",
                                result: "suc"
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, function (err1, doc) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                // 将商品信息加入到用户购物车里，形成完整文档
                                doc.productNum = 1; //商品数量为1
                                doc.checked = "1"; //商品默认选中
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2) { //保存到MongoDB数据库
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
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
                    });
                }
            }
        }
    })
})
module.exports = router;
