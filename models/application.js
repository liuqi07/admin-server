let mongodb = require('./mongodb');

let Schema = mongodb.mongoose.Schema;

let ApplicationSchema = new Schema({
    id: Number,
    userName: String,
    name: String,
    department: String, // 部门
    leaveDateBegin: String, // 请假开始时间
    leaveDateEnd: String, // 请假结束时间
    applicationDate: String, // 请假申请时间
    overtimeDateBegin: String, // 加班开始时间
    overtimeDateEnd: String, // 加班结束时间
    leaveProgress: Number, // 请假审批进程
    leaveReason: String, // 请假原因
    overtimeProgress: Number, // 加班审批进度
    overtimeReason: String, // 加班原因
    type: Number, // 请假1 加班2
    leaveType: String, // 请假方式: 调休、病假、事假、婚假
    successor: String, // 工作承接人
    role: Number, // 角色
    immediateLeaderId: Number, // 上级ID
    immdeiateLeader: String // 上级
})

module.exports = mongodb.mongoose.model('Application', ApplicationSchema);