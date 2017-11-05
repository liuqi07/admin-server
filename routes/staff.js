let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let Staff = require('../models/staff');


// 查询
router.get('/query', (req, res, next) => {
    // let obj = {id:1}
    let {userName, name} = req.query;
    if(!userName) delete req.query.userName;
    if(!name) delete req.query.name;
    // 查询show不为0的数据
    let query = Object.assign(req.query, {show: {$ne: 0}});
    console.log(query)
    Staff.find(query, (err, doc) => {
        if(err){
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '请求成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

// 添加用户
router.post('/add', (req, res, next) => {
    // console.log(req.body);
    let {userName} = req.body;
    let addData = req.body;
    let postData = Object.assign({userName}, {$set: addData});

    // 判断用户是否存在
    Staff.find({userName}, (err, doc) => {
        console.log(doc);
        if(err) {
            console.log(err);
        }else {
            if(doc.length===0){
                // 添加用户数据库中没有，执行添加
                let staffModel = new Staff(addData);
                staffModel.save((err) => {
                    if(err) {
                        console.log(err)
                    }else {
                        console.log('insert success')
                    }
                })
            }else{
                res.json({
                    status: 0,
                    msg: '用户名重复'
                })
            }
        }
    })
})

// 修改
router.post('/update', (req, res, next) => {
    // console.log(req.body);
    let {id} = req.body;
    let query = Object.assign({id}, {$set: req.body});

    Staff.update(query, (err, doc) => {
        if(err){
            res.json({
                status: 0,
                msg: err.message
            })
        }else{
            res.json({
                status: 1,
                msg: '更新成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

// 删除
router.post('/del', (req, res, next) => {
    let {id} = req.body;
    Staff.update({id}, {$set: {show: 0}}, (err, doc) => {
        if(err){
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '删除成功'
            })
        }
    })
})

module.exports = router;