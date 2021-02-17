const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChemSchema = new Schema({
     name: {type: String, required: true},
     price: {type:Number, required: true},
     weight: {type: Number},
     link: {type: String, required: true},
     source: {type: String, required: true},
     picture: {type: String}
})



module.exports = mongoose.model("Chemical", ChemSchema)