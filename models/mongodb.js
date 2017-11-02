let mongoose = require('mongoose');

// let db = mongoose.createConnection('localhost', 'test') // 创建一个数据库

mongoose.connect('mongodb://127.0.0.1:27017/admin-server')

mongoose.connection.on('connected', () => {
    console.log('success')
})

mongoose.connection.on('error', () => {
    console.log('error');
})

mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
})

exports.mongoose = mongoose;