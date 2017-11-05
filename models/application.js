let mongodb = require('./mongodb');

let Schema = mongodb.mongoose.Schema;

let ApplicationSchema = new Schema({
    id: Number,
    userName: String,
    name: String,
    department: String,
    leaveDateBegin: String,
    leaveDateEnd: String,
    applicationDate: String,
    overtimeDateBegin: String,
    overtimeDateEnd: String,
    leaveProgress: Number,
    leaveReason: String,
    progress: Number,
    type: Number,
    leaveType: String,
    successor: String,
    role: Number,
    immediateLeaderId: Number,
    immdeiateLeader: String
})

module.exports = mongodb.mongoose.model('Application', ApplicationSchema);