let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let Staff = require('../models/staff');

router.get('/', (req, res, next) => {
    // let obj = {id:1}
    let {userName, name} = req.query;
    if(!userName) delete req.query.userName;
    if(!name) delete req.query.name;
    // console.log(req.query.userName)
    // console.log(req.query.name)
    let query = Object.assign(req.query, {show: {$ne: 0}});
    
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

router.post('/add', (req, res, next) => {
    // console.log(req.body);
    let {userName} = req.body;
    let addData = req.body;
    let postData = Object.assign({userName}, {$set: addData});
    
    Staff.find({userName}, (err, doc) => {
        console.log(doc);
        if(err) {
            console.log(err);
        }else {
            if(doc.length===0){
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

router.post('/update', (req, res, next) => {
    // console.log(req.body);
    let {id,show} = req.body;
    let query = show===0?Object.assign({id},{$set: {show:0}}):Object.assign({id},{$set:req.body})
    // console.log(query)
    let msg = show===0?'删除成功':'更新成功';
    Staff.update(query, (err, doc) => {
        if(err){
            res.json({
                status: 0,
                msg: err.message
            })
        }else{
            res.json({
                status: 1,
                msg: msg,
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

module.exports = router;