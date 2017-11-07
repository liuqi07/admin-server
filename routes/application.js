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
    // leaveProgress 1 待主管审批 2 待总监审批 3 已审批  0 拒绝
    // role 1 员工 2 主管 3 总监
    applicationData.leaveProgress = req.body.role;
    Application.create(applicationData, (err) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
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
    console.log(req.query)
    let {id, type, pageSize} = req.query;
    let projection = {
        applicationDate: 1,
        name: 1,
        leaveProgress: 1,
        leaveDateBegin: 1,
        leaveDateEnd: 1,
        role: 1,
        leaveReason: 1
    }; // 定义返回字段
    Application.find({id,type}, projection)
        .sort({applicationDate: -1})
        .limit(parseFloat(pageSize))
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: 0,
                    msg: err.message
                })
            } else {
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
    // 判断是否总监已批
    Application.find({leaveProgress: 3, '_id': req.body['_id']}, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
            if (doc.length !== 0) {
                res.json({
                    status: 1,
                    msg: '删除失败，请求已审批'
                })
            } else {
                Application.remove({'_id': req.body['_id']}, (err, doc) => {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: err.message
                        })
                    } else {
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
            }
        }
    })

})

// 查询名下待审批数据
router.post('/queryNotApprove', (req, res, next) => {
    let {role} = req.body;
    let notApproveData = {} ;
    // 如果是总监角色登录，查询所有待总监审批leaveProgress=2的数据
    console.log(req.body)
    if(role==3){
        notApproveData = {leaveProgress: 2, type: 1};
    }else{
        notApproveData = {immediateLeaderId: req.body.id, leaveProgress: (req.body.role - 1), type: 1};
    }
    let projection = {
        id: 1,
        role: 1,
        name: 1,
        applicationDate: 1,
        leaveDateBegin: 1,
        leaveDateEnd: 1,
        leaveReason: 1,
        leaveType: 1,
        successor: 1,
        department: 1
    }
    Application.find(notApproveData, projection, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
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
    let approveData = {immediateLeaderId: req.body.id, $or: [{leaveProgress: req.body.role}, {leaveProgress: 0}], type: 1};
    let projection = {
        id: 1,
        role: 1,
        name: 1,
        applicationDate: 1,
        leaveDateBegin: 1,
        leaveDateEnd: 1,
        leaveReason: 1,
        leaveType: 1,
        successor: 1,
        department: 1,
        leaveProgress: 1
    };
    Application.find(approveData, projection, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
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

// 审批操作
router.post('/approve', (req, res, next) => {
    let {userName, _id, name, role, action} = req.body;
    // action: 1 同意 0 拒绝
    // let updateData = action===1?{_id, $set: {leaveProgress: role}}:{_id, $set: {leaveProgress: 0}};
    // let msg = action===1?'审批通过':'已拒绝申请';
    // Application.update(updateData, (err, doc) => {
    //     if(err){
    //         res.json({
    //             status: 0,
    //             msg: err.message
    //         })
    //     }else {
    //         res.json({
    //             status: 1,
    //             msg: msg
    //         })
    //     }
    // })
    let updateData = action === 1 ? {leaveProgress: role} : {leaveProgress: 0};
    let msg = action === 1 ? '审批通过' : '已拒绝申请';
    Application.updateOne({_id}, updateData, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
            res.json({
                status: 1,
                msg: msg
            })
        }
    })
})

// 拒绝操作
// router.post('/approve', (req, res, next) => {
//     let {userName, _id, name, role, action} = req.body;
//     // action: 1 同意 0 拒绝
//     // let updateData = action===1?{_id, $set: {leaveProgress: role}}:{_id, $set: {leaveProgress: 0}};
//     // let msg = action===1?'审批通过':'已拒绝申请';
//     // Application.update(updateData, (err, doc) => {
//     //     if(err){
//     //         res.json({
//     //             status: 0,
//     //             msg: err.message
//     //         })
//     //     }else {
//     //         res.json({
//     //             status: 1,
//     //             msg: msg
//     //         })
//     //     }
//     // })
//     console.log(req.body)
//     let updateData = action === 1 ? {leaveProgress: role} : {leaveProgress: 4};
//     let msg = action === 1 ? '审批通过' : '已拒绝申请';
//     console.log(updateData)
//     Application.updateOne({_id}, updateData, (err, doc) => {
//         if (err) {
//             res.json({
//                 status: 0,
//                 msg: err.message
//             })
//         } else {
//             res.json({
//                 status: 1,
//                 msg: msg
//             })
//         }
//     })
// })


// ---------------- 请假 ---------------------
// ---------------- 分割线 ---------------------
// ---------------- 加班 ---------------------


// 新增请加记录
router.post('/addOvertimeApplication', (req, res, next) => {
    let applicationData = req.body;
    // leaveProgress 1 待主管审批 2 待总监审批 3 已审批  0 拒绝
    // role 1 员工 2 主管 3 总监
    applicationData.overtimeProgress = req.body.role;
    Application.create(applicationData, (err) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
            res.json({
                status: 1,
                msg: '申请提交成功，请耐心等待审批'
            })
        }
    })
})

// 查询请假记录
router.get('/queryOvertimeRecord', (req, res, next) => {
    // type 申请类型 1 请假 2 加班
    let {id, type, pageSize} = req.query;
    let projection = {
        applicationDate: 1,
        name: 1,
        overtimeProgress: 1,
        overtimeDateBegin: 1,
        overtimeDateEnd: 1,
        role: 1,
        overtimeReason: 1
    }; // 定义返回字段
    Application.find({id, type}, projection)
        .sort({applicationDate: -1})
        .limit(parseFloat(pageSize))
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: 0,
                    msg: err.message
                })
            } else {
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
});

// 删除请假申请
router.post('/delOvertimeApplication', (req, res, next) => {
    // 判断是否总监已批
    Application.find({overtimeProgress: 3, '_id': req.body['_id']}, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
            if (doc.length !== 0) {
                res.json({
                    status: 1,
                    msg: '删除失败，请求已审批'
                })
            } else {
                Application.remove({'_id': req.body['_id']}, (err, doc) => {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: err.message
                        })
                    } else {
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
            }
        }
    })

})

// 查询名下待审批数据
router.post('/queryOvertimeNotApprove', (req, res, next) => {
    let notApproveData = {immediateLeaderId: req.body.id, overtimeProgress: (req.body.role - 1), type: 2};
    let projection = {
        id: 1,
        role: 1,
        name: 1,
        applicationDate: 1,
        overtimeDateBegin: 1,
        overtimeDateEnd: 1,
        overtimeReason: 1,
        department: 1
    }
    Application.find(notApproveData, projection, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
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

// 审批操作
router.post('/overtimeApprove', (req, res, next) => {
    let {userName, _id, name, role, action} = req.body;
    // action: 1 同意 0 拒绝
    let updateData = action === 1 ? {overtimeProgress: role} : {overtimeProgress: 0};
    let msg = action === 1 ? '审批通过' : '已拒绝申请';
    Application.updateOne({_id}, updateData, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
            res.json({
                status: 1,
                msg: msg
            })
        }
    })
})

// 查询名下已审批数据
router.post('/queryOvertimeApprove', (req, res, next) => {
    let approveData = {immediateLeaderId: req.body.id, $or: [{overtimeProgress: req.body.role}, {overtimeProgress: 0}], type: 2};
    let projection = {
        id: 1,
        role: 1,
        name: 1,
        applicationDate: 1,
        overtimeDateBegin: 1,
        overtimeDateEnd: 1,
        department: 1,
        overtimeProgress: 1
    };
    Application.find(approveData, projection, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            })
        } else {
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


module.exports = router;