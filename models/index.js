'use strict';

let models = {};
models.User = require('./user');
models.Company = require('./company');
models.Workplace = require('./workplace');
models.Message = require('./message');
models.Action = require('./action');


module.exports = models;