'use strict';
let db = require('../mongoose');


let priceSchema = new db.Schema({
    actionId: {
        type: db.Schema.Types.ObjectId
    },
    high: {
        type: Number
    },
    low: {
        type: Number
    },
    open: {
        type: Number
    },
    close: {
        type: Number
    },
    volume: {
        type: Number
    },
    adj: {
        type: Number
    },
    date:{
        type: Date
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

module.exports = db.model("prices", priceSchema);