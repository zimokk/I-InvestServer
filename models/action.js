'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const csv = require("fast-csv");
const fs = require('fs');
const db = require('../db');
const modelHelper = require('../helpers').model;
const Price = require('./price');

let model = {};

model.toDTO = async(function(action){
    return {
        _id: action._id,
        name: action.name,
        prices: action.prices
    }
});

model.getExisting = async (function(){
    let actions = await(db.Action.find({status: 'updated'}));
    return actions.map(action=>{
        return await (this.toDTO(action));
    });
});

model.addNew = async (function(action) {
    if(action){
        let newAction = new db.Action({
            name: action.name,
            state: action.state
        });
        const addActionResult = await (newAction.save());
        model.createFromPath("test.csv", addActionResult._id);
        return addActionResult;
    } else{
        return {statusCode: 404, data: null, message: "Action is null"};
    }
});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Action not found"};
    let action = await(db.Action.findOne({_id:id, status: 'updated'}));
    if (!action)
        return {statusCode: 404, data: null, message: "Action not found"};
    else{
        action.prices = await(Price.getByActionId(action._id));
        return {statusCode: 0, data: await(this.toDTO(action)), message: "Success"};
    }
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Action not found"};
    let action = await (db.Action.findOne({_id:id}));
    modelHelper.setStatusRemoved(action);
    let removedAction = action.save();
    return action;
});

model.createFromPath = async(function ( path, actionId ) {
    var stream = fs.createReadStream(path);

    csv.fromPath(path)
        .on("data", function(data){
            let date = data[0], open = data[1], high = data[2], low = data[3], close = data[4], volume = data[5], adj = data[6];
            Price.addNew({
                actionId: actionId,
                high: high,
                low: low,
                open: open,
                close: close,
                volume: volume,
                adj: adj,
                date: date
            })
        })
        .on("end", function(){
            
        });
});

model.findByName = async(function ( nameContains ) {
    let actions = await(db.Action.find({status: 'updated', "name" : {$regex : ".*"+nameContains+".*"}}));
    return actions.map(action=>{
        return await (this.toDTO(action));
    });
});

module.exports = model;