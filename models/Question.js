const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    choices: {
        type: [String],
        required: true
    },
    answer: {
        type: Number,
        required: true
    },
    questionImage: {
        type: String,
        required: false // Make it optional if not every question has an image
    },
    explanationImage: {
        type: String,
        required: false // Make it optional if not every explanation has an image
    }
});

module.exports = mongoose.model('Question', questionSchema);
