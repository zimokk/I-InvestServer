'use strict';
let users = require('./user');
let companies = require('./company');
let actions = require('./action');
let workplaces = require('./workplace');
let messages = require('./message');
let prices = require('./price');

let dbTables = {};
dbTables.User = users;
dbTables.Company = companies;
dbTables.Workplace = workplaces;
dbTables.Action = actions;
dbTables.Message = messages;
dbTables.Price = prices;

module.exports = dbTables;

