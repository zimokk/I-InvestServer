'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const statusCodes = require('../common/statuscodes');
const Workplace = require('../models/workplace');

let formObject = function ( req ) {
    return{
        _id: req.body.workplace._id || null,
        name: req.body.workplace.company,
        state: req.body.workplace.duration,
        userId: req.body.workplace.userId
    }
};

router.get('/all', function(req, res) {
    Workplace.getExisting().then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Workplaces result'
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
    Workplace.getById(req.params.id)
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

router.get('/getByUser/:id', function ( req, res ) {
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    Workplace.getByUserId(req.params.id).then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Workplaces result'
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

router.post('/new', function(req, res){
    let workplace = formObject(req);
    Workplace.addNew(workplace)
        .then(async(data=>{
            if(data){
                res.send({statusCode: statusCodes.success, data: data, message: 'Workplace successfully created'});
            }
            else{
                res.send({statusCode: statusCodes.serverError, data: null, message: 'Server Error'});
            }
        }))
        .catch(err=>{
            res.send({statusCode: 500, data: null, message: err.message});
        });
});

router.put('/update', function(req,res){
    let workplace = formObject(req);

    Workplace.update(workplace)
        .then(async(data=>{
            if(data){
                res.send({statusCode: statusCodes.success, data: data, message: 'Successfully updated'});
            }
            else{
                res.send({
                    statusCode: 500,
                    data: null,
                    message: 'Server Error'
                });
            }
        }))
        .catch(err=>{
            res.send({
                statusCode: 500,
                data: err,
                message: err.message
            });
        });
});

router.delete('/delete/:id', function(req,res){
    Workplace.removeById(req.params.id)
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
