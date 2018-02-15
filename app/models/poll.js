const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: validate that each question has at least two options
const optionSchema = new Schema({
    name: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const pollSchema = new Schema({
    question: String,
    options: [optionSchema],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    link: String
});

module.exports = mongoose.model('Poll', pollSchema);
