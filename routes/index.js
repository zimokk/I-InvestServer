'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const User = require('../models/user');

let user = require('./user');

/* GET home page. */
router.use('/user', user);

router.get('/', function(req, res, next) {
  res.json({ message: 'index' });
});

router.post('/authorize', function ( req, res, next ) {
  User.authorize({
      login: req.body.login,
      password: req.body.password
    }).then(function ( userRole ) {
      if(!userRole){
        res.send({
          statusCode: 500,
          data: null,
          message: 'Unauthorized'
        });
      }else{
        res.send({
          statusCode: 0,
          data: {
            role: userRole
          },
          message: 'Authorized'
        });
      }
  });
});

module.exports = router;
