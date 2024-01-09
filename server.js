const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Import User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Question = require('./models/Question'); // Import the Question model

const app = express();
const port = process.env.PORT || 3000;

// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' })); 
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB without the deprecated options
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  next();
}


// Route to get all questions
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a single question by id
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

// New route for redirecting to upload.html
app.get('/upload', authenticateToken, isAdmin, (req, res) => {
  res.redirect('/upload.html');
});

// New route for redirecting to upload.html
app.get('/upload.html', authenticateToken, isAdmin, (req, res) => {
  res.redirect('/upload.html');
});

app.get('/register', (req, res) => {
  res.redirect('/register.html');
});

app.get('/login', (req, res) => {
  res.redirect('/login.html');
});



app.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const oldUser = await User.findOne({ username: req.body.username });
    if (oldUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user
    const user = new User(req.body);
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      return res.status(400).send('Invalid credentials');
    }

    // Create token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});




// Existing route to add a question (kept for backward compatibility)
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