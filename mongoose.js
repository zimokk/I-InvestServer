var mongoose = require("mongoose");

//mongoose.set("debug", true);
// Connect to DB.
mongoose.connect('localhost:27017/coursedb');

var db = mongoose.connection;


db.on("error", function(err) {
    console.log("connection error:" + err.message);
});
db.once("open", function callback() {
    console.log("Connected to DB!");
});

// Exports module.
module.exports = mongoose;
