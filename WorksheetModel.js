const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let worksheetSchema = Schema({
    PDF: [String],
    Title: {type: String, required: true},
    LowerTitle: {type: String},
    ShortD: {type: String},
    Description: {type: String},
    AllDescript: {type: String, required: true},
    PreviewPic: {type: String},
    Grade: {type: Number},
    Section: {type: String}
});


module.exports = mongoose.model("Worksheet", worksheetSchema);