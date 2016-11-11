'use strict';
let db = require('../mongoose');


let priceSchema = new db.Schema({
    actionId: {
        type: db.Schema.Types.ObjectId
    },
    high: {
        type: Double
    },
    low: {
        type: Double
    },
    close: {
        type: Double
    },
    volume: {
        type: Integer
    },
    adj: {
        type: Double
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

module.exports = db.model("actions", actionSchema);