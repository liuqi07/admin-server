let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let Group = require('../models/group');

router.get('/query', (req, res, next) => {
    let queryData = Object.assign(req.query, {show: {$ne: 0}});
    Group.find(queryData, (err, doc) => {
        if(err) {
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '组查询成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

module.exports = router;