'use strict';
let db = require('../mongoose');


let actionSchema = new db.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
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

module.exports = db.model("actions", actionSchema);