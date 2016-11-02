'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const jwt = require('jsonwebtoken');
const db = require('../db');
const modelHelper = require('../helpers').model;

let model = {};

model.toDTO = async(function(user){
    return {
        _id: user._id,
        login: user.login,
        password: user.password,
        role: user.role,
        isBanned: user.isBanned,
        email: user.email,
        age: user.age,
        sex: user.sex,
        status: user.status
    }
});

let getByLogin = async(function(login){
    if(!login)
        return {statusCode: 404, data: null, message: "User not found"};
    let user = await(db.User.findOne({login:login, status: 'updated'}));
    if (!user)
        return {statusCode: 404, data: null, message: "User not found"};
    return {statusCode: 0, data: await(model.toDTO(user)), message: "Success"};
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
        role: user.role,
        isBanned: user.isBanned,
        email: user.email,
        age: user.age,
        sex: user.sex
    });
    const addUserResult = await (newUser.save());
    return addUserResult;
});

model.getById = async(function(_id){
    if(!_id)
        return {statusCode: 404, data: null, message: "User not found"};
    let user = await(db.User.findOne({_id:_id, status: 'updated'}));
    if (!user)
        return {statusCode: 404, data: null, message: "User not found"};
    return {statusCode: 0, data: await(this.toDTO(user)), message: "Success"};
});

model.update = async(function(data){
    let user = await(db.User.findOne({_id:data._id, status: 'updated'}));
    if(user){
        user.login =  data.login;
        user.password = data.password;
        user.role = data.role;
        user.email = data.email;
        user.isBanned = data.isBanned;
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
    let user = await (db.User.findOne({_id:_id, status: 'updated'}));
    modelHelper.setStatusRemoved(user);
    let removedUser = user.save();
    return removedUser;
});

model.ban = async(function ( _id ) {
    if(!_id)
        return {statusCode: 404, data: null, message: "User not found"};
    let user = await (db.User.findOne({_id:_id, status: 'updated'}));
    user.isBanned = true;
    let bannedUser = user.save();
    return bannedUser;
});

model.enable = async(function ( _id ) {
    if(!_id)
        return {statusCode: 404, data: null, message: "User not found"};
    let user = await (db.User.findOne({_id:_id, status: 'updated'}));
    user.isBanned = false;
    let bannedUser = user.save();
    return bannedUser;
});

model.tokenAutorize = async(function ( token ) {
    let decoded;
    try {
        decoded = jwt.verify(token, 'secret');
    } catch(err) {
        return err;
    }
    if(decoded){
        let dbUser = await(getByLogin(decoded.login)).data;
        if(!dbUser.isBanned){
            return {
                login: decoded.login,
                role: decoded.role,
                isBanned: decoded.isBanned,
                token: token
            };
        } else {
            return {
                statusCode: 403,
                name: 'Authorization error',
                data: null,
                message: 'Your account banned'
            }
        }
    }
});

model.login = async( function ( user ) {
    let dbUser = await(getByLogin(user.login)).data;
    if(!dbUser){
        return false;
    } else{
        if(dbUser.login == user.login && user.password == dbUser.password){
            if(!dbUser.isBanned){
                let token = await(jwt.sign(dbUser, "secret", {expiresIn: '1h'}));
                return {
                    login: dbUser.login,
                    role: dbUser.role,
                    isBanned: dbUser.isBanned,
                    token: token
                };
            } else {
                return {
                    statusCode: 403,
                    name: 'Authorization error',
                    data: null,
                    message: 'Your account banned'
                }
            }
        }
    }
} );

module.exports = model;
