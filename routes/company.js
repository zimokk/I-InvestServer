'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const statusCodes = require('../common/statuscodes');
const Company = require('../models/company');

let formObject = function ( req ) {
    return{
        _id: req.body.company._id || null,
        name: req.body.company.name,
        state: req.body.company.state,
        userId: req.body.company.userId,
        foundation: req.body.company.foundation,
        budget: req.body.company.budget
    }
};

router.get('/all', function(req, res) {
    Company.getExisting().then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Companies result'
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
    Company.getById(req.params.id)
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
    Company.getByUserId(req.params.id).then(function ( success ) {
        if(success){
            res.send({
                statusCode: 0,
                data: success,
                message: 'Companies result'
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
    let company = formObject(req);
    console.log(company.userId);
    Company.addNew(company)
        .then(async(data=>{
            if(data){
                res.send({statusCode: statusCodes.success, data: data, message: 'Company successfully created'});
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
    let company = formObject(req);

    Company.update(company)
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
    Company.removeById(req.params.id)
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
