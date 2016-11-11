'use strict';
const csv = require("fast-csv");
const async = require('asyncawait/async');
const await = require('asyncawait/await');

let tool = {};

tool.read = async(function(){
    csv.fromPath("test.csv")
        .on("data", function(data){
            console.log(data);
        })
        .on("end", function(){
            console.log("done");
        });
});

module.exports = tool;