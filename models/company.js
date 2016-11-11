'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;
let User = require('./user');

let model = {};

model.toDTO = async(function(company){
    return {
        _id: company._id,
        name: company.name,
        state: company.state,
        userId: company.userId,
        foundation: company.foundation,
        budget: company.budget
    }
});

model.getExisting = async (function(){
    let companies = await(db.Company.find({status: 'updated'}));
    return companies.map(company=>{
        return await (this.toDTO(company));
    });
});

model.createMock = function () {
    model.addNew({
        name: 'Topaz',
        state: 1832,
        userId: 1,
        foundation: 2016,
        budget: 500000
    });
};

model.addNew = async (function(company) {
    let user = await(User.getById(company.userId));
    if(user){
        let newCompany = new db.Company({
            name: company.name,
            state: company.state,
            userId: user.data._id,
            foundation: company.foundation,
            budget: company.budget
        });
        const addCompanyResult = await (newCompany.save());
        return addCompanyResult;
    } else{
        return {statusCode: 404, data: null, message: "User not found"};
    }

});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Company not found"};
    let company = await(db.Company.findOne({_id:id, status: 'updated'}));
    if (!company)
        return {statusCode: 404, data: null, message: "Company not found"};
    return {statusCode: 0, data: await(this.toDTO(company)), message: "Success"};
});

model.getByUserId = async(function(userId){
    let companies = await(db.Company.find({userId:userId, status: 'updated'}));
    return companies.map(company=>{
        return await (this.toDTO(company));
    });
});

model.update = async(function(data){

    let company = await(db.Company.findOne({_id:data._id}));
    if(company){
        company.name =  data.name;
        company.state = data.state;
        company.userId = data.userId;
        company.foundation = data.foundation;
        company.budget = data.budget;

        modelHelper.setStatusUpdated(company);
        await(company.save());
    }

    return this.toDTO(company);
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Company not found"};
    let company = await (db.Company.findOne({_id:id}));
    modelHelper.setStatusRemoved(company);
    let removedCompany = company.save();
    return company;
});

model.removeAllByUserId = async (function(userId){
    if(!userId)
        return {statusCode: 404, data: null, message: "Company not found"};
    let companies = await(db.Company.find({userId:userId, status: 'updated'}));
    if(companies){
        companies.forEach(company=>{
            modelHelper.setStatusRemoved(company);
        });
        return companies.map(company=>{
            return await (this.toDTO(company));
        });
    }
});

module.exports = model;