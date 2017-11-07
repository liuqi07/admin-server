let mongodb = require('./mongodb');

let GroupSchema = new mongodb.mongoose.Schema({
    GroupName: String,
    id: Number,
    show: Number
})

module.exports = mongodb.mongoose.model('Group', GroupSchema, 'group');