let mongoose = require('mongoose');

// let db = mongoose.createConnection('localhost', 'test') // 创建一个数据库
let url = 'mongodb://59.110.165.79:27017/admin-server';
// let url = 'mongodb://127.0.0.1:27017/admin-server';

mongoose.connect(url, {
    useMongoClient: true
})
mongoose.connect(url, {
    useMongoClient: true
})


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