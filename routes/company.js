'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const Company = require('../models/company');

let formObject = function ( req ) {
    return{
        name: req.body.name,
        state: req.body.state,
        userId: req.body.userId,
        foundation: req.body.foundation,
        budget: req.body.budget
    }
};

router.get('/all', function(req, res, next) {
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
    User.getById(req.params.id)
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

router.post('/new', function(req, res){
    let company = formObject(req);

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
