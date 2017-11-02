let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StaffSchema = new Schema({
    id: Number,
    name: String,
    staffId: String,
    userName: String,
    pwd: String,
    phone: String
});

module.exports = mongoose.model('Staff', StaffSchema);

