'use strict';
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const csv = require("fast-csv");
const fs = require('fs');

let tool = {};

tool.readFromPath = async(function(path){
    var stream = fs.createReadStream(path);

    var csvStream = csv()
        .on("data", function(data){
           // console.log(data);
        })
        .on("end", function(){
            console.log("done");
        });
    stream.pipe(csvStream);
    console.log(stream.pipe(csvStream));

    stream.pipe(csvStream);
    // let dataArray = [];
    // csv.fromPath(path)
    //     .on("data", function(data){
    //         dataArray.push(data);
    //     })
    //     .on("end", function(){
    //         console.log(1);
    //         return dataArray;
    //     });
    // console.log(2);
    // console.log(dataArray);
    // return dataArray;
});

tool.readFromStream = async(function(stream){
    let dataArray = [];
    let result = await(csv.fromStream(stream)
        .on("data", function(data){
            dataArray.push(data);
        })
        .on("end", function(){
            return dataArray;
        }));
    console.log(result);
    return result;
});

module.exports = tool;