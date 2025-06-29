const questions = [
    {
        question: "About how much money does it take to fund one clean water project?",
        answers: ["$1,000", "$10,000", "$5,000", "$50,000"],
        correct: "$10,000"
    },
    {
        question: "What does access to clean water improve?",
        answers: ["education", "income", "wealth", "all of the above"],
        correct: "all of the above"
    },
    {
        question: "Who collects most of the water for the community?",
        answers: ["women and girls", "men and boys", "adults", "children"],
        correct: "women and girls"
    },
    {
        question: "Every $1 invested in joint water supply and sanitaztion provides how much in economic return?",
        answers: ["$10.10", "$0.50", "$5", "$4.30"],
        correct: "$4.30"
    },
    {
        question: "How many people live without clean water?",
        answers: ["703 million", "508 million", "1.2 billion", "230 million"],
        correct: "703 million"
    }
]

// Get difficulty from localStorage
const savedMode = localStorage.getItem("difficulty");

if (!savedMode) {
  // No difficulty chosen — send user back to home page
  window.location.href = "index.html";
}


// Declare mode after retrieving difficulty
let mode = {
  difficulty: savedMode,
  lives: 0,
  time: 0
};
const questionCard = document.getElementById("question-card");
const cardContainer = document.getElementById("card-container");
const scoreDisplay = document.getElementById("score");
const nextButton = document.getElementById("next-btn");
const replayButton = document.getElementById("replay-btn");
const endMessage = document.getElementById("end-message");
const easyButton = document.getElementById("easy-btn");
const mediumButton = document.getElementById("medium-btn");
const hardButton = document.getElementById("hard-btn");
const menuButton = document.getElementById("menu-btn");
const lives = document.getElementById("lives");
const correctSound = new Audio("sounds/correct.mp3");
const incorrectSound = new Audio("sounds/incorrect.mp3");
let countdownInterval; 

let duration = mode.time;
let score = 0;
let currentIndex = 0; 


//event listeners for end pop-up
replayButton.addEventListener("click", () => {
  resetGame();
});

easyButton.addEventListener("click", () => {
  mode.difficulty = "easy"
  mode.time = 30;
  mode.lives = -1;
  resetGame();
});

mediumButton.addEventListener("click", () => {
  mode.difficulty = "medium";
  mode.time = 20;
  mode.lives = 3;
  resetGame();
});

hardButton.addEventListener("click", () => {
  mode.difficulty = "hard";
  mode.time = 10;
  mode.lives = 1;
  resetGame();
});

menuButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

switch(mode.difficulty){
  case "easy":
    mode.time = 30; // Set mode.time here
    mode.lives = -1; // -1 means unlimited lives
    setTimer(mode.time);
    setLives(mode.lives); 
    break;
  case "medium":
    mode.time = 20;
    mode.lives = 3; 
    setTimer(mode.time);
    setLives(mode.lives);
    break;
  case "hard":
    mode.time = 10;
    mode.lives = 1;
    setTimer(mode.time);
    setLives(mode.lives);
    break;
}

shuffle(questions); 

// Show first question
createCard();

// ----- NEXT BUTTON -----
nextButton.addEventListener("click", () => {
  currentIndex++;
  nextButton.style.display = "none";
  if (currentIndex < questions.length && mode.lives !== 0) {
    createCard();
    setTimer(mode.time);
  }
  else{
      endGame();
  }
});
