'use strict';
let users = require('./user');
let companies = require('./company');
let actions = require('./action');
let workplaces = require('./workplace');

let dbTables = {};
dbTables.User = users;
dbTables.Company = companies;
dbTables.Workplace = workplaces;
dbTables.Action = actions;

module.exports = dbTables;

