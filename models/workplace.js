'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;
let User = require('./user');

let model = {};

model.toDTO = async(function(workplace){
    return {
        _id: workplace._id,
        company: workplace.company,
        duration: workplace.duration,
        userId: workplace.userId
    }
});

model.getExisting = async (function(){
    let companies = await(db.Workplace.find({status: 'updated'}));
    return companies.map(workplace=>{
        return await (this.toDTO(workplace));
    });
});

model.addNew = async (function(workplace) {
    let user = await(User.getById(workplace.userId));
    if(user){
        let newWorkplace = new db.Workplace({
            company: workplace.company,
            duration: workplace.duration,
            userId: user.data._id
        });
        console.log(newWorkplace);
        const addWorkplaceResult = await (newWorkplace.save());
        return addWorkplaceResult;
    } else{
        return {statusCode: 404, data: null, message: "User not found"};
    }

});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Workplace not found"};
    let workplace = await(db.Workplace.findOne({_id:id}));
    if (!workplace)
        return {statusCode: 404, data: null, message: "Workplace not found"};
    return {statusCode: 0, data: await(this.toDTO(workplace)), message: "Success"};
});

model.getByUserId = async(function(userId){
    let workplaces = await(db.Workplace.find({userId:userId, status: 'updated'}));
    return workplaces.map(workplace=>{
        return await (this.toDTO(workplace));
    });
});

model.update = async(function(data){

    let workplace = await(db.Workplace.findOne({_id:data._id}));
    if(workplace){
        workplace.company =  data.company;
        workplace.duration = data.duration;
        workplace.userId = data.userId;

        modelHelper.setStatusUpdated(workplace);
        await(workplace.save());
    }

    return this.toDTO(workplace);
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Workplace not found"};
    let workplace = await (db.Workplace.findOne({_id:id}));
    modelHelper.setStatusRemoved(workplace);
    let removedCompany = workplace.save();
    return workplace;
});

module.exports = model;