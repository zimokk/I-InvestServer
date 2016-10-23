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

router.post('/', function(req, res, next) {
  res.json({message: 'respond with a Post'});
});

module.exports = router;
