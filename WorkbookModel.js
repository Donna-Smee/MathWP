const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let workbookSchema = Schema({
    Title: {type: String, required: true},
    Price: {type: Number, required: true},
    Format:[mongoose.Schema.Types.Mixed],
    PrizeCode: {type: String},
    ShortDescription: {type: String},
    Description: {type: String},
    PreviewPics: {data: Buffer, contentType: String},
    PageNumbers: [mongoose.Schema.Types.Mixed],
    PrizeCodes: [mongoose.Schema.Types.Mixed]
});


module.exports = mongoose.model("Workbook", workbookSchema);