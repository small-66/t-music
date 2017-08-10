var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema(
  {
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String
  }
)

/*文件输出*/
module.exports = mongoose.model('Good',productSchema)

