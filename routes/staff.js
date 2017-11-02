let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let Staff = require('../models/staff');

let app = express();
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

router.get('/', (req, res, next) => {
    // let obj = {id:1}
    console.log(req.query)
    Staff.find(req.query, (err, doc) => {
        if(err){
            res.json({
                status: '0',
                msg: err.message
            })
        }else {
            res.json({
                status: '1',
                msg: '请求成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

router.post('/update', (req, res, next) => {
    console.log(req.body);
    let {id} = req.body;
    Staff.update({id},{$set:req.body}, (err, doc) => {
        if(err){
            res.json({
                status: '0',
                msg: err.message
            })
        }else{
            res.json({
                status: '1',
                msg: '更新成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

module.exports = router;