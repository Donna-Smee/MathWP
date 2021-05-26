const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let pageSchema = Schema({
    Section: {type: Number, required: true},
    PageNum: {type: Number, required: true},
    Questions: [mongoose.Schema.Types.Mixed],
    workbookName: {type: String} // might wanna change to objectid
});


module.exports = mongoose.model("Page", pageSchema);