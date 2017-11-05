let mongoose = require('mongoose')
let express = require('express')
let router = express.Router()
let Leave = require('../models/leave')

// 新增请加记录
router.post('/application', (req, res, next) => {
    let applicationData = req.body;
    let LeaveModel = new Leave(applicationData)
    LeaveModel.save((err) => {
        if(err){
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '申请提交成功，请耐心等待审批'
            })
        }
    })
})

// 查询请假记录
router.get('/queryRecord', (req, res, next) => {
    let {id, type} = req.query;
    let projection = {applicationDate:1, name: 1, progress: 1, leaveDateBegin: 1, leaveDateEnd: 1}; // 定义返回字段
    Leave.find({id}, projection)
        .sort({applicationDate:-1})
        .exex((err, doc) => {
            if(err) {
                res.json({
                    status: 0,
                    msg: err.message
                })
            }else {
                res.json({
                    status: 1,
                    msg: '查询成功',
                    result: {
                        count: doc.length,
                        list: doc
                    }
                })
            }
        })
})

// 删除请假申请
router.post('/delApplication', (req, res, next) => {
    let {id, applicationDate} = req.body;
    Leave.remove({id, applicationDate}, (err, doc) => {
        if(err) {
            res.json({
                status: 0,
                msg: err.message
            })
        }else {
            res.json({
                status: 1,
                msg: '删除成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

// 查询名下待审批数据
router.post('/queryNotApprove', (req, res, next) => {
    let notApproveData = {immediateLeaderId: req.body.id, progress: 2};
    let projection = {name:1, applicationDate:1, leaveDateBegin:1, leaveDateEnd: 1}
    Leave.find(notApproveData, projection, (err, doc) => {
        if(err){
            console.log(err.message);
        }else {
            res.json({
                status: 1,
                msg: '查询成功'
            })
        }
    })
})
// 查询名下已审批数据
router.post('/queryApprove', (req, res, next) => {
    let approveData = {immediateLeaderId: req.body.id, $and: [{progress: 3}, {progress: 4}]};
    let projection = {name:1, applicationDate:1, leaveDateBegin:1, leaveDateEnd: 1}
    Leave.find(approveData, projection, (err, doc) => {
        if(err){
            console.log(err.message);
        }else {
            res.json({
                status: 1,
                msg: '查询成功'
            })
        }
    })
})

// 审批 拒绝  操作
router.post('/approve', (req, res, next) => {
    let {userName, id, name, action} = req.body;
    let updateDate = {id, $set: {progress: action}};
    let msg = action==1?'审批通过':'已拒绝申请'
    Leave.update(updateDate, (err, doc) => {
        if(err){
            console.log(err.message);
        }else {
            res.json({
                status: 1,
                msg: msg
            })
        }
    })
})

module.exports = router;