let mongoose = require('mongoose')
let express = require('express')
let router = express.Router()
let Application = require('../models/application')

// 新增请加记录
router.post('/addApplication', (req, res, next) => {
    let applicationData = req.body;
    // let ApplicationModel = new Application(applicationData)
    // ApplicationModel.save((err) => {
    //     if(err){
    //         res.json({
    //             status: 0,
    //             msg: err.message
    //         })
    //     }else {
    //         res.json({
    //             status: 1,
    //             msg: '申请提交成功，请耐心等待审批'
    //         })
    //     }
    // })
    applicationData.leaveProgress = req.body.role;
    console.log(applicationData)
    Application.create(applicationData, (err) => {
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
    // type 申请类型 1 请假 2 加班
    let {id, type, pageSize} = req.query;
    let projection = {applicationDate:1, name: 1, leaveProgress: 1, leaveDateBegin: 1, leaveDateEnd: 1, role: 1}; // 定义返回字段
    Application.find({id}, projection)
        .sort({applicationDate:-1})
        .limit(parseFloat(pageSize))
        .exec((err, doc) => {
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
    Application.remove({'_id':req.body['_id']}, (err, doc) => {
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
    let notApproveData = {immediateLeaderId: req.body.id, leaveProgress: (req.body.role-1)};
    let projection = {id: 1, role: 1, name:1, applicationDate:1, leaveDateBegin:1, leaveDateEnd: 1, leaveReason: 1, leaveType: 1, successor: 1, department: 1}
    Application.find(notApproveData, projection, (err, doc) => {
        if(err){
            console.log(err.message);
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
// 查询名下已审批数据
router.post('/queryApprove', (req, res, next) => {
    let approveData = {immediateLeaderId: req.body.id, $and: [{progress: 3}, {progress: 4}]};
    let projection = {name:1, applicationDate:1, leaveDateBegin:1, leaveDateEnd: 1}
    Application.find(approveData, projection, (err, doc) => {
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
    let {userName, _id, name, role, action} = req.body;
    let updateData = {_id, $set: {leaveProgress: role}};
    let msg = action==1?'审批通过':'已拒绝申请';
    console.log(req.body);
    console.log(updateData)
    Application.update(updateData, (err, doc) => {
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