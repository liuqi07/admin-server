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
    immdeiateLeaderId: Number,
    role: Number
});

module.exports = mongodb.mongoose.model('Staff', StaffSchema);

