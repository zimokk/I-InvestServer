'use strict';
let express = require('express');
let router = express.Router();

let users = require('./users');

/* GET home page. */
router.use('/users', users);

router.get('/', function(req, res, next) {
  res.json({ message: 'index' });
});

module.exports = router;
