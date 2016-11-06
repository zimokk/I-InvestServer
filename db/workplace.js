'use strict';
let db = require('../mongoose');


let actionSchema = new db.Schema({
    company: {
        type: String,
        required: [true, 'company is required']
    },
    duration: {
        type: String,
        required: [true, 'duration is required']
    },
    userId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "updated"
    }
});

module.exports = db.model("workplaces", actionSchema);