/**
 * Created by Administrator on 2017/11/16.
 */

let mongodb = require('./mongodb');
let Schema = mongodb.mongoose.Schema;

let NewSchema = new Schema({
    type: String,
    createTime: String,
    content: String
});

module.exports = mongodb.mongoose.model('New', NewSchema);