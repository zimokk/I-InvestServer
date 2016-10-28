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
        email: user.email,
        age: user.age,
        sex: user.sex,
        status: user.status
    }
});

let getByLogin = async(function(login){
    if(!login)
        return {statusCode: 4, data: null, message: "User not found"};
    let user = await(db.User.findOne({login:login, status: 'updated'}));
    if (!user)
        return {statusCode: 4, data: null, message: "User not found"};
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
    let user = await(db.User.findOne({_id:_id, status: 'updated'}));
    if (!user)
        return {statusCode: 4, data: null, message: "User not found"};
    return {statusCode: 0, data: await(this.toDTO(user)), message: "Success"};
});

model.update = async(function(data){
    let user = await(db.User.findOne({_id:data._id, status: 'updated'}));
    if(user){
        user.login =  data.login;
        user.password = data.password;
        user.role = data.role;
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
    let user = await (db.User.findOne({_id:_id, status: 'updated'}));
    modelHelper.setStatusRemoved(user);
    let removedUser = user.save();
    return removedUser;
});

model.tokenAutorize = async(function ( token ) {
    let decoded;
    try {
        decoded = jwt.verify(token, 'secret');
    } catch(err) {
        return err;
    }
    if(decoded){
        return {
            login: decoded.login,
            role: decoded.role,
            token: token
        };
    }
    // let dbUser = await(getByLogin(user.login)).data;
    // if(!dbUser){
    //     return false;
    // } else{
    //     if(dbUser.login == user.login && user.password == dbUser.password){
    //         let token = await(jwt.sign(dbUser, "secret", {expiresIn: '1h'}));
    //         return {
    //             login: dbUser.login,
    //             role: dbUser.role,
    //             token: token
    //         };
    //     }
    // }
});

model.login = async( function ( user ) {
    let dbUser = await(getByLogin(user.login)).data;
    if(!dbUser){
        return false;
    } else{
        if(dbUser.login == user.login && user.password == dbUser.password){
            let token = await(jwt.sign(dbUser, "secret", {expiresIn: '1h'}));
            return {
                login: dbUser.login,
                role: dbUser.role,
                token: token
            };
        }
    }
} );

module.exports = model;
