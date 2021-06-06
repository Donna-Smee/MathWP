const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let purchaseSchema = Schema({
    purchaseID: {type: String, required: true},
    date: {type: Date, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    products: [],
    paidAmount: {type:Number, required: true},
    amountItems: {type: Number, required: true}
});


module.exports = mongoose.model("Purchase", purchaseSchema);