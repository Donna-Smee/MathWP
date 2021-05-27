const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let logSchema = Schema({
    Date: {type: Date, required: true},
    Day: {type: Number, required: true},
    Month: {type: Number, required: true},
    Year: {type: Number, required: true}
});


module.exports = mongoose.model("Log", logSchema);