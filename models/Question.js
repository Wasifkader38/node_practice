// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    choices: [String],
    answer: Number,
    questionImage: String,
    explanationImage: String
  });

module.exports = mongoose.model('Question', questionSchema);
