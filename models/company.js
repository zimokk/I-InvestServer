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

model.removeById = async (function(id){
    if(!id)
        return {statusCode: 4, data: null, message: "Company not found"};
    let company = await (db.Company.findOne({_id:id}));
    modelHelper.setStatusRemoved(company);
    let removedCompany = company.save();
    return company;
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