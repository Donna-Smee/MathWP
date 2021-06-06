const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let workbookSchema = Schema({
    Title: {type: String, required: true},
    LowerTitle: {type: String, required: true},
    Price: {type: Number, required: true},
    Format:[mongoose.Schema.Types.Mixed],
    ShortDescription: {type: String},
    Description: {type: String},
    AllDescript: {type: String, required: true},
    CoverPic: {type: String},
    PreviewPics: [mongoose.Schema.Types.Mixed],
    PageNumbers: [mongoose.Schema.Types.Mixed],
    PrizeCodes: [mongoose.Schema.Types.Mixed],
    Subject: {type: String},
    Grade: {type:String}
});


module.exports = mongoose.model("Workbook", workbookSchema);