"use strict";
let express = require('express');
let router = express.Router();
const User = require('../models/user');

/* GET users listing. */
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
  let user = {
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    age: req.body.age,
    sex: req.body.sex
  };

  User.addNew(user)
      .then(async(data=>{
        if(data){
          res.send({statusCode: statusCodes.success, data: data, message: 'User successfully updated'});
        }
        else{
          res.send({statusCode: statusCodes.serverError, data: null, message: 'Server Error'});
        }
      }))
      .catch(err=>{
        res.send({statusCode: 500, data: null, message: err.message});
      });
});

module.exports = router;
