var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema(
  {
    "songName": String,
    "songer": String,
    "songImg": String,
    "songurl": String
  }
)

/*文件输出*/
module.exports = mongoose.model('Music',productSchema)
