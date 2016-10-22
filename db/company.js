'use strict';
let db = require('../mongoose');


let companySchema = new db.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    state: {
        type: Number,
        required: [true, 'state is required']
    },
    userId: [db.Schema.Types.ObjectId],
    foundation: Number,
    budget: Number,
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "updated"
    }
});

module.exports = db.model("companies", companySchema);