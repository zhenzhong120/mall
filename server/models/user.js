var mongoose = require("mongoose"); //安装mongoose插件
// var Schema = mongoose.Schema;
// var userSchema = new Schema({
    
// })
var userSchema = new mongoose.Schema({  //定义表模型
"userId":String,
"userName":String,
"userPwd":String,
"orderList":Array,
"cartList":[
    {
        "productId":String,
        "productName":String,
        "productPrice":Number,
        "productImg":String,
        "checked":String,
        "productNum":Number,
        
    }
],
"addressList":[{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": Number,
    "tel": Number,
    "isDefault": Boolean
  }]

});

module.exports = mongoose.model("User",userSchema); 
//导出模型，第一个参数是自定义模型名字，第二个参数是创建的表模型，如果mongodb数据库中创建的集合名字不带s
//则需要配置第三个参数，users，模型根据这个名字去匹配集合中的内容
// 不加s,会让User这个自定义名字自动加s去匹配数据库中的集合