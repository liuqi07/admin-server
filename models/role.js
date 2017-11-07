let mongodb = require('./mongodb');

let RoleSchema = new mongodb.mongoose.Schema({
    roleName: String,
    id: Number,
    show: Number
})

module.exports = mongodb.mongoose.model('Role', RoleSchema);