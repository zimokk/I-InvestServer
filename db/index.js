'use strict';
let users = require('./user');
let companies = require('./company');
let actions = require('./action');

let dbTables = {};
dbTables.User = users;
dbTables.Company = companies;
dbTables.Action = actions;

module.exports = dbTables;

