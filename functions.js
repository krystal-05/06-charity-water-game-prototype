// Go to the game page after selecting difficulty
function goToGame() {
  const selectedMode = document.getElementById("difficulty").value;

  if (!selectedMode) {
    alert("Please select a difficulty!");
    return;
  }

  // Store mode in localStorage
  localStorage.setItem("difficulty", selectedMode);

  // Redirect to game page
  window.location.href = "game.html";
}

// Shuffle the array of questions
function shuffle(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    // Create a random index
    const j = Math.floor(Math.random() * (i + 1));
    // Swap i and j
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Create and display a new question card
function createCard() {
  const card = questions[currentIndex];

  // Remove any old card so only one card shows at a time
  cardContainer.innerHTML = "";

  // Create a new card
  const newCard = questionCard.cloneNode(true);
  newCard.removeAttribute("id");
  newCard.style.display = "block";

  // Set the question text
  const questionSection = newCard.querySelector("#question-text");
  questionSection.textContent = card.question;

  // Get the answers container from the new card
  const answersContainer = newCard.querySelector("#card-answers");

  // Create answer buttons for each answer
  card.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;

    button.addEventListener("click", () => {
      const allButtons = answersContainer.querySelectorAll("button");
      // If correct answer
      if (answer === card.correct) {
        correctSound.play();
        button.classList.add("correct");
        score++;
        scoreDisplay.textContent = score;
      } else {
        incorrectSound.play();
        button.classList.add("incorrect");
        // Show the correct answer
        allButtons.forEach(btn => {
          if (btn.textContent === card.correct) {
            btn.classList.add("correct");
          }
        });
        livesRemaining = removeLife(livesRemaining);
        if (livesRemaining === 0) {
          endGame();
          // Ensures next button doesn't display
          return;
        }
      }
      // Disable all buttons so you can't keep clicking
      allButtons.forEach(btn => btn.disabled = true);
      // Only show Next button if there are more questions and the player has lives left
      if (currentIndex < questions.length - 1 && livesRemaining !== 0) {
        nextButton.style.display = "inline-block";
      } else {
        endGame();
      }
      clearInterval(countdownInterval);
    });

    // Add the button to the answers container
    answersContainer.appendChild(button);
  });

  // Add the new card to the card container
  cardContainer.appendChild(newCard);
}

// -------- TIMER ----------
function setTimer(duration) {
  // Always stop any old timer before starting a new one
  clearInterval(countdownInterval);

  const timerElement = document.getElementById("timer");
  timerElement.textContent = duration;

  // Start a new timer
  countdownInterval = setInterval(function () {
    duration--;
    timerElement.textContent = duration;

    if (duration <= 0) {
      clearInterval(countdownInterval);
      timerElement.textContent = "0";

      // Show correct answer
      const currentCard = cardContainer.lastElementChild;
      const correctAnswer = questions[currentIndex].correct;
      const allButtons = currentCard.querySelectorAll("button");

      allButtons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
          btn.classList.add("correct");
        }
        btn.disabled = true;
      });
      incorrectSound.play();
      alert("⏰ Time's up!");
      livesRemaining = removeLife(livesRemaining);
      if (livesRemaining === 0) {
        endGame();
        return;
      }

      // Only show Next button if there are more questions and the player has lives left
      if (currentIndex < questions.length - 1 && livesRemaining !== 0) {
        nextButton.style.display = "inline-block";
      } else {
        endGame();
      }
    }
  }, 1000); // Run every 1 second
}

// ------- Lives -------
function setLives(value) {
  livesRemaining = value;
  lives.textContent = livesRemaining === -1 ? "∞" : livesRemaining;
}

function removeLife(livesRemaining) {
  // Get the lives element from the DOM
  const livesElement = document.getElementById("lives");
  if (livesRemaining === -1) return -1; 
  livesRemaining--;
  livesElement.textContent = livesRemaining;
  return livesRemaining;
}

// ------- End Game -------
function endGame() {
  // Stop the timer
  clearInterval(countdownInterval);
  // Hide the Next button when the game is over
  nextButton.style.display = "none";

  endMessage.style.display = "block";
  endMessage.innerHTML = `
    <h2>🎉 Game Over!</h2>
    <p>You got <strong>${score}</strong> out of <strong>${questions.length}</strong> questions right!</p>
    <p>Thanks for playing!</p>
  `;
  endPopup.style.display = "block";
  replayButton.style.display = "inline-block";
  menuButton.style.display = "inline-block";

  // Always hide all difficulty buttons first
  easyButton.style.display = "none";
  mediumButton.style.display = "none";
  hardButton.style.display = "none";

  // Only show the buttons for levels that are NOT the current one
  if (mode.difficulty !== "easy") {
    easyButton.style.display = "inline-block";
  }
  if (mode.difficulty !== "medium") {
    mediumButton.style.display = "inline-block";
  }
  if (mode.difficulty !== "hard") {
    hardButton.style.display = "inline-block";
  }
}

// ------- Reset Game -------
function resetGame() {
  // Clear variables
  currentIndex = 0;
  score = 0;
  scoreDisplay.textContent = score;

  // Hide end screen and buttons
  endPopup.style.display = "none"; // <-- Change "block" to "none"
  endMessage.style.display = "none";
  replayButton.style.display = "none";
  menuButton.style.display = "none";
  easyButton.style.display = "none";
  mediumButton.style.display = "none";
  hardButton.style.display = "none";

  // Clear all old cards and restart
  cardContainer.innerHTML = "";
  shuffle(questions);
  setLives(mode.lives);
  setTimer(mode.time);
  createCard();
}

