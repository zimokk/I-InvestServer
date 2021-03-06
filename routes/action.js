'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const statusCodes = require('../common/statuscodes');
const Action = require('../models/action');

let formObject = function ( req ) {
    return{
        _id: req.body.action._id || null,
        name: req.body.action.name
    }
};

router.get('/all', function(req, res) {
    Action.getExisting().then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Actions result'
                });
            } else {
                res.send({
                    statusCode: 500,
                    data: null,
                    message: 'Server Error'
                });
            }
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

router.get('/get/:id', function(req,res){
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    Action.getById(req.params.id)
        .then(success=>{
            res.send(success);
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

router.get('/getTop', function(req,res){
    Action.getTop()
        .then(success=>{
            res.send({
                statusCode: 0,
                data: success,
                message: 'Top actions'
            });
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Worst actions'
            });
        });
});

router.get('/getTopChangingArray', function(req,res){
    Action.getTopChangingArray()
        .then(success=>{
            res.send({
                statusCode: 0,
                data: success,
                message: 'Top changing actions array'
            });
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

router.get('/getBottom', function(req,res){
    Action.getBottom()
        .then(success=>{
            res.send({
                statusCode: 0,
                data: success,
                message: 'Server error'
            });
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

router.post('/new', function(req, res){
    let action = formObject(req);
    Action.addNew(action)
        .then(async(data=>{
            if(data){
                res.send({statusCode: statusCodes.success, data: data, message: 'Action successfully created'});
            }
            else{
                res.send({statusCode: statusCodes.serverError, data: null, message: 'Server Error'});
            }
        }))
        .catch(err=>{
            res.send({statusCode: 500, data: null, message: err.message});
        });
});

router.post('/findByName', function(req, res){
    let nameContains = req.body.nameContains;
    Action.findByName(nameContains).then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Actions result'
                });
            } else {
                res.send({
                    statusCode: 500,
                    data: null,
                    message: 'Server Error'
                });
            }
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

router.delete('/delete/:id', function(req,res){
    Action.removeById(req.params.id)
        .then(success=>{
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Successfully deleted'
                });
            }
            else{
                res.send({
                    statusCode: 500,
                    data: null,
                    message: 'Server Error'
                });
            }
        })
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: 'Server error'
            });
        });
});

module.exports = router;
