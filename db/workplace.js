'use strict';
let db = require('../mongoose');


let actionSchema = new db.Schema({
    company: {
        type: String,
        required: [true, 'name is required']
    },
    duration: {
        type: String,
        required: [true, 'price is required']
    },
    userId: {
        type: [db.Schema.Types.ObjectId],
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