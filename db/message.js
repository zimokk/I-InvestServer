'use strict';
let db = require('../mongoose');


let messageSchema = new db.Schema({
    title: {
        type: String
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    authorId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: db.Schema.Types.ObjectId
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

module.exports = db.model("messages", messageSchema);