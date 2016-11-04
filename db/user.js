'use strict';
let db = require('../mongoose');


let userSchema = new db.Schema({
    login: {
        type: String,
        required: [true, 'login is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        required: [true, 'role is required']
    },
    isBanned: Boolean,
    email: String,
    age: Number,
    sex: String,
    firstName: String,
    lastName: String,
    phone: String,
    skype: String,
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