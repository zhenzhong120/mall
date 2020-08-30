var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var productSchema = new Schema({
    "productId":{type : String},
    "productName":String,
    "productPrice":Number,
    "productImg":String,
    "checked":String,   
    "productNum":Number
});
module.exports = mongoose.model('Good',productSchema);