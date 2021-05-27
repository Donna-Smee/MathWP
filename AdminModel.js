const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let adminSchema = Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    SecretKey: {type: String, required: true},
    SquareS: [Number],
    Locked: {type: Boolean, required: true}
});


module.exports = mongoose.model("Admin", adminSchema);