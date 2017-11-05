let mongodb = require('./mongodb');

let Schema = mongodb.mongoose.Schema;

let LeaveSchema = new Schema({
    userName: String,
    name: String,
    department: String,
    leaveDateBegin: String,
    leaveDateEnd: String,
    overtimeDateBegin: String,
    overtimeDateEnd: String,
    successor: String,
    leaveReason: String,
    progress: Number,
    type: Number,
    leaveType: String
})

module.exports = mongodb.mongoose.model('Leave', LeaveSchema);