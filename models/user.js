'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;

let model = {};

model.toDTO = async(function(user){
    return {
        _id: user._id,
        login: user.login,
        password: user.password,
        email: user.email,
        age: user.age,
        sex: user.sex
    }
});

model.getExisting = async (function(){
    let users = await(db.User.find({status: 'updated'}));
    return users.map(user=>{
        return await (this.toDTO(user));
    });
});

model.addNew = async (function(user) {
    let newUser = new db.User({
        login: user.login,
        password: user.password,
        email: user.email,
        age: user.age,
        sex: user.sex
    });
    const addUserResult = await (newUser.save());
    return addUserResult;
});

model.getById = async(function(_id){
    if(!_id)
        return {statusCode: 4, data: null, message: "User not found"};
    let user = await(db.User.findOne({_id:_id}));
    if (!user)
        return {statusCode: 4, data: null, message: "User not found"};
    return {statusCode: 0, data: await(this.toDTO(user)), message: "Success"};
});

model.update = async(function(data){

    let user = await(db.User.findOne({_id:data._id}));
    if(user){
        user.login =  data.login;
        user.password = data.password;
        user.email = data.email;
        user.age = data.age;
        user.sex = data.sex;

        modelHelper.setStatusUpdated(user);
        await(user.save());
    }

    return this.toDTO(user);
});

model.removeById = async (function(_id){
    if(!_id)
        return {statusCode: 4, data: null, message: "User not found"};
    let user = await (db.User.findOne({_id:_id}));
    modelHelper.setStatusRemoved(user);
    let removedUser = user.save();
    return user;
});

module.exports = model;
