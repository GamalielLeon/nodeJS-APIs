const mongoose = require('mongoose');
const { Schema } = mongoose;

const CharacterSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    status: { type: String },
    species: { type: String },
    type: { type: String, default: '' },
    gender: { type: String },
    origin: { name: { type: String }, url: { type: String }, },
    location: { name: { type: String }, url: { type: String }, },
    image: { type: String },
    episode: { type: Array },
    url: { type: String },
    created: { type: Date, default: Date.now },
    __v: { type: Number, select: false },
    versionKey: false
});
module.exports = mongoose.model('Character', CharacterSchema);