const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const nextButton = document.getElementById('nextButton');
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let selectedChoice = null; 
let classToApply = null;

let questions = [
  {
    question: "	What is the angle between the lines y=(2-√3)x-8 and y=(2+√3)x+4 ?",
    choice1: "30°",
    choice2: "45°",
    choice3: "60°",
    choice4: "90°",
    answer: 2,
    questionImage: "./2.png",
    explanationImage: "./1.png"
  },
  {
    question: "What is the slope of the line defined by 4x+y=17?",
    choice1: "4",
    choice2: "-17",
    choice3: "-4",
    choice4: "17",
    answer: 3,
    questionImage: "./2.png",
    explanationImage: "./2.png"
  },
  {
    question: "(0, 2) and (8, 6) are two points having the same distance from point P which is situated on the x axis. What are the co-ordinates of P?",
    choice1: "(6, 3)",
    choice2: "(12, 0)",
    choice3: "(3, 0)",
    choice4: "(6, 0)",
    answer: 4,
    //questionImage: "./2.png",
    explanationImage: "./3.png"
  }
];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

async function loadQuestions() {
  try {
    const response = await fetch('/questions'); // Adjust the URL if needed
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return []; // Return an empty array in case of an error
  }
}

async function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuesions = await loadQuestions(); // Load questions from the server
  mx=availableQuesions.length
  getNewQuestion();
  // Other initializations if necessary
}



getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= mx) {
    return window.location.assign("/index.html");
  }
  
  question.style.display = 'block'; // Show the question
  startTimer();

  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${mx}`;
  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];

  // Display the question image after setting the current question
  displayQuestionImage(currentQuestion);

  question.innerText = currentQuestion.question;

  choices.forEach((choice, index) => {
    choice.innerText = currentQuestion.choices[index]; // Update this line
    choice.style.display = 'block';
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};




choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    clearInterval(timerInterval); // Stop the timer
    acceptingAnswers = false;

    const selectedAnswer = parseInt(e.target.dataset["number"]);
    const correctAnswer = currentQuestion.answer + 1; // Adjust if your answer index is 0-based
    const classToApply = selectedAnswer === correctAnswer ? "correct" : "incorrect";
    e.target.classList.add(classToApply); // Apply class to the clicked element

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    displayExplanationImage(currentQuestion.explanationImage);
    nextButton.classList.remove('hidden');

    // Scroll to the explanation image
    setTimeout(() => {
      const explanationImageContainer = document.getElementById('explanationImageContainer');
      if (!explanationImageContainer.classList.contains('hidden')) {
        explanationImageContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // Adjusted timeout for smoother experience
  });
});

nextButton.addEventListener('click', () => {
  // Reset the classes for all choices
  choices.forEach(choice => {
    choice.classList.remove('correct', 'incorrect');
  });

  hideExplanationImage();
  nextButton.classList.add('hidden');
  acceptingAnswers = true; // Allow new answers
  getNewQuestion(); // Load the next question
});

function displayQuestionImage(question) {
  const questionImageContainer = document.getElementById("questionImageContainer");
  const questionImage = document.getElementById('questionImage');
  if (question.questionImage && question.questionImage !== "") {
    questionImage.src = question.questionImage;
    questionImageContainer.classList.remove('hidden');
  } else {
    questionImageContainer.classList.add('hidden');
  }
}


function displayExplanationImage(imageUrl) {
  const imgContainer = document.getElementById('explanationImageContainer');
  const img = document.getElementById('explanationImage');

  img.src = imageUrl;
  img.style.display = 'block';
  img.style.marginLeft = 'auto';
  img.style.marginRight = 'auto';
  img.style.marginTop = '0';

  imgContainer.classList.remove('hidden'); // Show the container
}

function hideExplanationImage() {
  const imgContainer = document.getElementById("explanationImageContainer");

  if (imgContainer) {
      imgContainer.classList.add('hidden'); // Hide the container
  }
}

function hideQuestionImage() {
  const questionImageContainer = document.getElementById("questionImageContainer");
  if (questionImageContainer) {
      questionImageContainer.classList.add('hidden');
  }
}

incrementScore = num => {
  score += num;
  scoreText.innerText = score;

  if (questionCounter === mx) {
    // If yes, navigate to the result page
    navigateToResultPage(score);
  }

};


//time function

let timeLeft = 60; // seconds
let timerInterval;

function startTimer() {
  timeLeft = 60; // Reset time for each question
  document.getElementById('timeLeft').innerText = timeLeft; // Update display immediately

  clearInterval(timerInterval); // Clear any existing timer

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timeLeft').innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Handle what happens when the time is up
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  // Logic for what happens when time is up. For example:
  alert("Time's up!");
  getNewQuestion(); // Move to the next question
}



function navigateToResultPage(score) {

  window.location.href = `/result.html?score=${score}`;
}


startGame();
