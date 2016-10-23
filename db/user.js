'use strict';
let db = require('../mongoose');


let userSchema = new db.Schema({
    login: {
        type: String,
        required: [true, 'login is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    email: String,
    age: Number,
    sex: String,
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "updated"
    }
});

module.exports = db.model("users", userSchema);