'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;
let User = require('./user');

let model = {};

model.toDTO = async(function(message){
    return {
        _id: message._id,
        title: message.title,
        text: message.text,
        authorId: message.authorId,
        receiverId: message.receiverId
    }
});

model.getExisting = async (function(){
    let messages = await(db.Message.find({status: 'updated'}));
    return messages.map(message=>{
        return await (this.toDTO(message));
    });
});

model.addNew = async (function(message) {
    let author = await(User.getById(message.authorId));
    let receiver = await(User.getById(message.receiverId));
    if(author && receiver){
        let newMessage = new db.Message({
            title: message.title,
            text: message.text,
            authorId: author.data._id,
            receiverId: receiver.data._id
        });
        const addMessageResult = await (newMessage.save());
        return addMessageResult;
    } else{
        return {statusCode: 404, data: null, message: "User not found"};
    }

});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Message not found"};
    let message = await(db.Message.findOne({_id:id, status: 'updated'}));
    if (!message)
        return {statusCode: 404, data: null, message: "Message not found"};
    return {statusCode: 0, data: await(this.toDTO(message)), message: "Success"};
});

let addLogins = function ( messagesArray ) {
    messagesArray.forEach(function ( message ) {
        if(message.authorId){
            message.authorLogin = await(User.getById(message.authorId)).data.login;
        }
        if(message.receiverId){
            message.receiverLogin = await(User.getById(message.receiverId)).data.login;
        }
    });
    return messagesArray;
};

model.getByAuthorId = async(function(authorId){
    let messages = await(db.Message.find({authorId:authorId, status: 'updated'}));
    return (addLogins(messages.map(message=>{
        return await (this.toDTO(message));
    }))).reverse();

});

model.getByReceiverId = async(function(receiverId){
    let messages = await(db.Message.find({receiverId:receiverId, status: 'updated'}));
    return (addLogins(messages.map(message=>{
        return await (this.toDTO(message));
    }))).reverse();
});

model.getByReceiverLogin = async(function(receiverLogin){
    let receiver = await(User.getByLogin(receiverLogin));
    let messages = await(db.Message.find({receiverId:receiver.data._id, status: 'updated'}));
    console.log(messages)
    return (addLogins(messages.map(message=>{
        return await (this.toDTO(message));
    }))).reverse();
});

model.update = async(function(data){

    let message = await(db.Message.findOne({_id:data._id}));
    if(message){
        message.title =  data.title;
        message.text = data.text;
        message.authorId = data.authorId;
        message.receiverId = data.receiverId;
        modelHelper.setStatusUpdated(message);
        await(message.save());
    }

    return this.toDTO(message);
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Message not found"};
    let message = await (db.Message.findOne({_id:id}));
    modelHelper.setStatusRemoved(message);
    let removedMessage = message.save();
    return message;
});

module.exports = model;