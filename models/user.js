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

model.createMock = function () {
    model.addNew({
        login: "login",
        password: "pass",
        email: "zimokk1@gmail.com",
        age: 20,
        sex: 'male'
    });
};

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

model.getById = async(function(id){
    if(!id)
        return {statusCode: 4, data: null, message: "User not found"};
    let user = await(db.User.findOne({_id:id}));
    if (!user)
        return {statusCode: 4, data: null, message: "User not found"};
    return {statusCode: 0, data: await(this.toDTO(user)), message: "Success"};
});

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 4, data: null, message: "User not found"};
    let user = await (db.User.findOne({_id:id}));
    modelHelper.setStatusRemoved(user);
    let removedUser = user.save();
    return user;
});

// model.updateBuilding = async(function(data){
//
//     let building = await(db.Building.findOne({_id:data.id}));
//     const imgModel = require('./image');
//     if(building){
//         building.title = data.title;
//         building.description = data.description;
//         building.longitude = data.longitude;
//         building.latitude = data.latitude;
//
//         //replace gallery
//         if(data.gallery && data.gallery.length > 0){
//             await (imgModel.removeRange(building.galleryIds));
//
//             building.galleryIds = await (imgModel.addMany(data.gallery));
//         }
//         //replace 3d model
//         if(data.images && data.images.length > 0){
//             await (imgModel.removeRange(building.imageIds));
//             building.imageIds = await (imgModel.addMany(data.images));
//         }
//
//         //add new images for gallery
//         if(data.galleryAdditions && data.galleryAdditions.length >0){
//             building.galleryIds = [...building.galleryIds, ...await (imgModel.addMany(data.galleryAdditions))] ;
//         }
//         //add new images for 3d model
//         if(data.imagesAdditions && data.imagesAdditions.length >0){
//             building.imageIds = [...building.imageIds, ...await (imgModel.addMany(data.imagesAdditions))] ;
//         }
//         if(data.headerPdf){
//             await (imgModel.removeById(data.headerPdfId));
//             building.headerPdfId = await (imgModel.addNew(data.headerPdf))._id;
//         }
//
//         if(data.footerPdf){
//             await (imgModel.removeById(data.footerPdfId));
//             building.footerPdfId = await (imgModel.addNew(data.footerPdf))._id;
//         }
//
//         modelHelper.setStatusUpdated(building);
//         console.dir(building.headerPdfId);
//         await(building.save());
//         console.dir(building.headerPdfId);
//     }
//
//     return this.toDTO(building);
// });
//
// model.getUpdates = async (function(lastUpdateTime){
//     let dateISO = new Date(lastUpdateTime).toISOString();
//     let updatedBuildings = await(db.Building.find().where('updatedAt').gt(dateISO));
//
//     if(lastUpdateTime == 0){
//         updatedBuildings = updatedBuildings.filter(building=>{
//             return building.status === 'updated';
//         })
//     }
//
//     return updatedBuildings;
// });
//

//
// model.update = async(function(data){
//     const imgModel = require('./image');
//
//     let building = await (db.Building.findOne({_id:data.id}));
//     if (!building)
//         return null;
//     building.title = data.title || building.title;
//     building.description = data.description || building.description;
//     building.longitude = data.longitude || building.longitude;
//     building.latitude = data.latitude || building.latitude;
//     if(data.images && data.images.length > 0){
//         await (imgModel.removeRange(building.imageIds));
//         building.imageIds = await (imgModel.addManyOrdered(data.images));
//     }
//     if(data.gallery && data.gallery.length > 0){
//         await (imgModel.removeRange(building.galleryIds));
//         building.galleryIds = await (imgModel.addMany(data.gallery));
//     }
//
//     modelHelper.setStatusUpdated(building);
//     return await(building.save());
// });
//
//
// model.removeFromGallery = async(function(buildingId, imageId){
//     const imgModel = require('./image');
//     let building = await(db.Building.findOne({_id:buildingId}));
//     building.galleryIds.splice(building.galleryIds.indexOf(imageId), 1);
//     await (imgModel.removeById(imageId));
//     modelHelper.setStatusUpdated(building);
//     return await (building.save());
// });
//
// model.removeFromImages = async(function(buildingId, imageId){
//     const imgModel = require('./image');
//     let building = await(db.Building.findOne({_id:buildingId}));
//     building.imageIds.splice(building.imageIds.indexOf(imageId), 1);
//     await (imgModel.removeById(imageId));
//     modelHelper.setStatusUpdated(building);
//     return await (building.save());
// });

module.exports = model;
