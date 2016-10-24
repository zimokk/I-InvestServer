/**
 * Created by Dmitry_ on 23.10.2016.
 */
'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;

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
    let newCompany = new db.Company({
        _id: company._id,
        name: company.name,
        state: company.state,
        userId: company.userId,
        foundation: company.foundation,
        budget: company.budget
    });
    const addCompanyResult = await (newCompany.save());
    return addCompanyResult;
});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 4, data: null, message: "Company not found"};
    let company = await(db.Company.findOne({_id:id}));
    if (!company)
        return {statusCode: 4, data: null, message: "Company not found"};
    return {statusCode: 0, data: await(this.toDTO(company)), message: "Success"};
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
        return {statusCode: 4, data: null, message: "Company not found"};
    let company = await (db.Company.findOne({_id:id}));
    modelHelper.setStatusRemoved(company);
    let removedCompany = company.save();
    return company;
});

module.exports = model;