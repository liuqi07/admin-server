/**
 * Created by Administrator on 2017/11/16.
 */

let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let New = require('../models/new');

// 查询
router.get('/query', (req, res, next) => {
    let {size, page, type} = req.query;
    console.log(req.query)
    let query = {type};
    type==='newest'?(delete query.type):type;
    console.log(query)
    New.find(query)
        .skip((page-1)*10)
        .sort({createTime: -1})
        .limit(parseFloat(size))
        .exec( (err,doc) => {
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
    });
});

module.exports = router;