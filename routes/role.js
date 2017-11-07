let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let Role = require('../models/role');

router.get('/query', (req, res, next) => {
    let projection = {_id: 1, roleName: 1}
    let queryData = Object.assign(req.query, {show: {$ne: 0}});
    Role.find(queryData, (err, doc) => {
        if(err) {
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '角色查询成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

module.exports = router;