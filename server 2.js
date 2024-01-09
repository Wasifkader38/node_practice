const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Question = require('./models/Question'); // Import the Question model

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());
app.use(express.static('public'));
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Route to get questions
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/questions/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const question = await Question.findById(id);
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

app.post('/questions', async (req, res) => {
    try {
      const question = new Question({
        question: req.body.question,
        choices: req.body.choices,
        answer: req.body.answer,
        questionImage: req.body.questionImage,
        explanationImage: req.body.explanationImage
      });

    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
