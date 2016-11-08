'use strict';

let models = {};
models.User = require('./user');
models.Company = require('./company');
models.Workplace = require('./workplace');
models.Message = require('./message');


module.exports = models;