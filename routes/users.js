"use strict";
let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message: 'respond with a resource'});
});

router.post('/', function(req, res, next) {
  res.json({message: 'respond with a Post'});
});

module.exports = router;
