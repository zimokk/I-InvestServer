'use strict';
let helper = {};

helper.setStatusRemoved = function(model){
    model.status = 'removed';
    model.updatedAt = new Date().toISOString();
    return model;
};

helper.setStatusUpdated = function(model){
    model.status = 'updated';
    model.updatedAt = new Date().toISOString();
    return model;
};

module.exports = helper;