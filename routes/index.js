'use strict';
let express = require('express');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
let router = express.Router();
const User = require('../models/user');

let user = require('./user');
let company = require('./company');
let workplace = require('./workplace');
let message = require('./message');
let action = require('./action');
const Csv = require('../tools/csv_parser');

/* GET home page. */
router.use('/user', user);
router.use('/company', company);
router.use('/workplace', workplace);
router.use('/message', message);
router.use('/action', action);

router.get('/', function(req, res, next) {
  res.json({ message: 'index' });
});

router.post('/authorize', function ( req, res, next ) {
  let token = req.body.token;
  if(token){
    User.tokenAutorize(token).then(function ( data ) {
      if(!data){
        res.send({
          statusCode: 500,
          data: null,
          message: 'Unauthorized'
        });
      } else if(data.message && data.name) {
        if(data.statusCode == 403){ //permissions denied - Banned
          return data;
        } else {
          res.send({
            statusCode: 500,
            data: data,
            message: 'Token error'
          });
        }
      } else{
        res.send({
          statusCode: 0,
          data: data,
          message: 'Authorized'
        });
      }
    });
  } else{
    User.login({
      login: req.body.login,
      password: req.body.password
    }).then(function ( data ) {
      if(!data){
        res.send ( {
          statusCode: 500,
          data: null,
          message: 'Unauthorized'
        } );
      } else{
        if(data.statusCode == 403){ //permissions denied - Banned
          res.send(data);
        } else {
          res.send ( {
            statusCode: 0,
            data: data,
            message: 'Authorized'
          } );
        }
      }
    });
  }
});

module.exports = router;
