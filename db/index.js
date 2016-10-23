'use strict';
let users = require('./user');
let companies = require('./company');

let dbTables = {};
dbTables.User = users;
dbTables.Company = companies;

module.exports = dbTables;

