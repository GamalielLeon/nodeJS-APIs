const { validationMessage } = require('../constants/functions');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const EpisodeSchema = new Schema({
    id: {
        type: Number,
        required: [true, validationMessage('required', 'id')],
        cast: validationMessage('cast', 'id'),
        validate: {
            validator: v => v > 0 && Number.isInteger(v),
            message: validationMessage('positiveInteger', 'id')
        },
        unique: true
    },
    name: {
        type: String,
        required: [true, validationMessage('required', 'name')],
        unique: true,
        trim: true
    },
    air_date: {
        type: String,
        required: [true, validationMessage('required', 'air_data')],
        trim: true
    },
    episode: {
        type: String,
        required: [true, validationMessage('required', 'episode')],
        unique: true,
        trim: true
    },
    characters: { type: Array, default: [] },
    url: { type: String },
    created: { type: Date, default: Date.now },
    __v: { type: Number, select: false },
    versionKey: false
});

module.exports = mongoose.model('Episode', EpisodeSchema);