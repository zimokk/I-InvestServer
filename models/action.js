'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;

let model = {};

model.toDTO = async(function(action){
    return {
        _id: action._id,
        name: action.name
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
    return {statusCode: 0, data: await(this.toDTO(action)), message: "Success"};
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Action not found"};
    let action = await (db.Action.findOne({_id:id}));
    modelHelper.setStatusRemoved(action);
    let removedAction = action.save();
    return action;
});

module.exports = model;