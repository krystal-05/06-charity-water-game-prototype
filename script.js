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
const questionCard = document.getElementById("question-card");
const cardContainer = document.getElementById("card-container");
const scoreDisplay = document.getElementById("score");
const nextButton = document.getElementById("next-btn");
const replayButton = document.getElementById("replay-btn");
const endMessage = document.getElementById("end-message");

let score = 0;
let currentIndex = 0; 

//shuffle the array of questions
function shuffle(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    //creates a random index
    const j = Math.floor(Math.random() * (i + 1));
    //swapping i and j 
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

shuffle(questions); 

function createCard(){
  const card = questions[currentIndex];

  //create one card 
  const newCard = questionCard.cloneNode(true);
  //avoid duplicate id's
  newCard.removeAttribute("id");
  newCard.style.display = "block";

  //create the question 
  const questionSection = newCard.querySelector("#question-text");
  questionSection.textContent = card.question;

  // Get answers container from the newCard
  const answersContainer = newCard.querySelector("#card-answers");


  //create answers for each card
  card.answers.forEach(answer => {
      const button = document.createElement("button");
      button.textContent = answer;

      button.addEventListener("click", () => {
          const allButtons = answersContainer.querySelectorAll("button");
          //if correct answer 
          if (answer === card.correct) {
              button.classList.add("correct");
              score++;
              scoreDisplay.textContent = score;
          }
          //incorrect answer
          else {
              button.classList.add("incorrect");
              //loop through the buttons to find the correct answer and make the button green
              //the textContent needs to match the correct answer 
              allButtons.forEach(btn => {
                  if (btn.textContent === card.correct) {
                      btn.classList.add("correct");
                  }
              });
          }
          //disable all buttons so you can’t keep clicking
          allButtons.forEach(btn => btn.disabled = true);
          // Show Next button
          nextButton.style.display = "inline-block";
          
      });

      //add buttons after all logic is created
      answersContainer.appendChild(button);
  });

  //add the card to the container that holds all the cards 
  cardContainer.appendChild(newCard);
}

// Show first question
createCard();

// ----- NEXT BUTTON -----
nextButton.addEventListener("click", () => {
  currentIndex++;
  nextButton.style.display = "none";
  if (currentIndex < questions.length){
    createCard();
  }
  else{
      endMessage.style.display = "block";
      endMessage.innerHTML = `
        <h2>🎉 Game Over!</h2>
        <p>You got <strong>${score}</strong> out of <strong>${questions.length}</strong> questions right!</p>
        <p>Thanks for playing!</p>
      `;
      replayButton.style.display = "inline-block";
        replayButton.addEventListener("click", () => {
        //Clear variables
        currentIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;

        // Hide end screen
        endMessage.style.display = "none";
        replayButton.style.display = "none";

        // Clear all old cards and restart
        cardContainer.innerHTML = "";
        shuffle(questions);
        createCard();
      });
  }
  
});