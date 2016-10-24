'use strict';
let express = require('express');
let router = express.Router();

let user = require('./user');

/* GET home page. */
router.use('/user', user);

router.get('/', function(req, res, next) {
  res.json({ message: 'index' });
});

module.exports = router;
