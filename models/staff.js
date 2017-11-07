let mongodb = require('./mongodb');

let Schema = mongodb.mongoose.Schema;

let StaffSchema = new Schema({
    id: Number,
    name: String,
    staffId: String,
    userName: String,
    pwd: String,
    phone: String,
    show: Number,
    email: String,
    immediateLeader: String,
    immediateLeaderId: Number,
    role: Number,
    department: String
});

module.exports = mongodb.mongoose.model('Staff', StaffSchema);

