'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const statusCodes = require('../common/statuscodes');
let router = express.Router();
const User = require('../models/user');

let formObject = function ( req ) {
    return{
        _id: req.body.user._id || null,
        login: req.body.user.login,
        password: req.body.user.password,
        isBanned: req.body.user.isBanned || false,
        role: req.body.user.role || 'user',
        email: req.body.user.email,
        age: req.body.user.age,
        sex: req.body.user.sex
    }
};

router.get('/all', function(req, res, next) {
  User.getExisting().then(function ( success ) {
    if(success){
      res.send({
        statusCode: 0,
        data: success,
        message: 'Users result'
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
  let user = formObject(req);
  User.addNew(user)
      .then(async(data=>{
        if(data){
          res.send({statusCode: statusCodes.success, data: data, message: 'User successfully created'});
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
  let user = formObject(req);

  User.update(user)
      .then(async(data=>{
        if(data){
          res.send({
              statusCode: statusCodes.success,
              data: data,
              message: 'Successfully updated'
          });
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

router.put('/ban/:id', function ( req,res ) {
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    User.ban(req.params.id)
        .then(success=>{
            res.send({
                statusCode: 0,
                data: success,
                message: 'User banned'
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

router.put('/enable/:id', function ( req,res ) {
    if (!req.params.id){
        res.send({
            statusCode: 500,
            data: null,
            message: 'id not found'
        });
    }
    User.enable(req.params.id)
        .then(success=>{
            res.send({
                statusCode: 0,
                data: success,
                message: 'User enabled'
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

router.delete('/delete/:id', function(req,res){
    User.removeById(req.params.id)
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
