'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const db = require('../db');
const modelHelper = require('../helpers').model;
let Action = require('./action');

let model = {};

model.toDTO = async(function(price){
    return {
        _id: price._id,
        actionId: price.actionId,
        high: price.high,
        low: price.low,
        open: price.open,
        close: price.close,
        volume: price.volume,
        adj: price.adj,
        date: price.date
    }
});

model.getExisting = async (function(){
    let prices = await(db.Price.find({status: 'updated'}));
    return prices.map(price=>{
        return await (this.toDTO(price));
    });
});

model.addNew = async (function(price) {
    if(price.actionId){
        let newPrice = new db.Price({
            actionId: price.actionId,
            high: price.high,
            low: price.low,
            open: price.open,
            close: price.close,
            volume: price.volume,
            adj: price.adj,
            date: price.date
        });
        newPrice.save();
        // const addPriceResult = await (newPrice.save());
        // return addPriceResult;
    } else{
        return {statusCode: 404, data: null, message: "Action not found"};
    }

});

model.getById = async(function(id){
    if(!id)
        return {statusCode: 404, data: null, message: "Price not found"};
    let price = await(db.Price.findOne({_id:id, status: 'updated'}));
    if (!price)
        return {statusCode: 404, data: null, message: "Price not found"};
    return {statusCode: 0, data: await(this.toDTO(price)), message: "Success"};
});

model.getByActionId = async(function(actionId){
    let prices = await(db.Price.find({actionId:actionId, status: 'updated'}));
    return prices.map(price=>{
        return await (this.toDTO(price));
    });
});

model.getChanges = async(function ( action ) {
    let lastPrices = await(db.Price.find({actionId:action._id, status: 'updated'}).sort({ $natural: -1 }).limit(10)).map(price=>{
        return await (this.toDTO(price));
    });
    let startPrice = lastPrices[9].close;
    let endPrice = lastPrices[0].close;
    return (startPrice - endPrice) / startPrice * 100;
});

module.exports = model;