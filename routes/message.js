'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const statusCodes = require('../common/statuscodes');
const Message = require('../models/message');

let formObject = function ( req ) {
    return{
        _id: req.body.message._id || null,
        title: req.body.message.title,
        text: req.body.message.text,
        authorId: req.body.message.authorId,
        receiverId: req.body.message.receiverId
    }
};

router.get('/all', function(req, res) {
    Message.getExisting().then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Messages result'
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
    Message.getById(req.params.id)
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

router.get('/getByAuthor/:id', function ( req, res ) {
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    Message.getByAuthorId(req.params.id).then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Messages result'
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

router.get('/getByReceiver/:id', function ( req, res ) {
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    Message.getByReceiverId(req.params.id).then(function ( success ) {
            if(success){
                res.send({
                    statusCode: 0,
                    data: success,
                    message: 'Messages result'
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
    let message = formObject(req);
    Message.addNew(message)
        .then(async(data=>{
            if(data){
                res.send({statusCode: statusCodes.success, data: data, message: 'Message successfully created'});
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
    let message = formObject(req);

    Message.update(message)
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
    Message.removeById(req.params.id)
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
