// Declaring Variables
var containerEl = document.querySelector(".container");
var timerEL = document.querySelector(".timer");
var questionsEl = document.querySelector(".questions");
var startEL = document.querySelector(".startQuiz");
var questionBank = [
  {
    question: "Commonly used data types DO NOT include:",
    choices: ["strings", "booleans", "alerts", "numbers"],
    answer: "alerts",
  },
  {
    question: "The condition in an if / else statement is enclosed within ______.",
    choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
    answer: "parentheses",
  },
  {
    question: "Arrays in Javascript can be used to store ______.",
    choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    answer: "all of the above",
  },
  {
    question: "String values must be enclosed within ______ when being assigned to variables.",
    choices: ["commas", "curly brackets", "quotes", "parenthesis"],
    answer: "quotes",
  },
  {
    question:
      "A very useful tool for used during development and debugging for printing content to the debugger is:",
    choices: ["Javascript", "terminal / bash", "for loops", "console log"],
    answer: "console log",
  },
];
var questionBankIndex = 0;
var score = 0;
var secondsLeft = 76;
var quizTimer = 0;
var penalty = 10;
var ulEl = document.createElement("ul");

// High Score Variables
var highScore = document.querySelector("#highScore");
var clear = document.querySelector("#clear");
// var goBack = document.querySelector("#goBack");

// Event Listener for the begin button to begin the quiz
startEL.addEventListener("click", function () {
  if (quizTimer === 0) {
    quizTimer = setInterval(function () {
      secondsLeft--;
      timerEL.textContent = "Time: " + secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(quizTimer);
        complete();
        timerEL.textContent = "Time's up!";
      }
    }, 1000);
  }
  timerEL.style.display = "block";
  renderQuiz(questionBankIndex);
});

// Function to begin the quiz and renders the questions and answers
function renderQuiz(questionBankIndex) {
  //Clear text for questions and choices
  questionsEl.innerHTML = "";
  ulEl.innerHTML = "";

  for (var i = 0; i < questionBank.length; i++) {
    var renderQuestion = questionBank[questionBankIndex].question;
    var renderChoices = questionBank[questionBankIndex].choices;
    questionsEl.textContent = renderQuestion;
  }

  renderChoices.forEach(function (newChoice) {
    var liEL = document.createElement("li");
    liEL.textContent = newChoice;
    questionsEl.appendChild(ulEl);
    ulEl.appendChild(liEL);
    liEL.addEventListener("click", validateAnswer);
    liEL.setAttribute("class", "choiceLi");
  });
}

//Function to validate the answers
function validateAnswer(event) {
  var element = event.target;

  //Returns message to validate the answers chosen to the user
  if (element.matches("li")) {
    var resultEl = document.createElement("div");
    resultEl.setAttribute("class", "answerResult");

    if (element.textContent == questionBank[questionBankIndex].answer) {
      score++;
      resultEl.textContent = "Correct!";
    } else {
      secondsLeft = secondsLeft - penalty;
      resultEl.textContent = "Wrong! The correct answer is:  " + questionBank[questionBankIndex].answer;
    }
  }
  questionBankIndex++;

  if (questionBankIndex >= questionBank.length) {
    complete();
    // resultEl.textContent = "";
  } else {
    renderQuiz(questionBankIndex);
  }
  questionsEl.appendChild(resultEl);
}

//  Creating the label for user to input initials

var initialsLabel = document.createElement("label");
initialsLabel.setAttribute("class", "inputInitials");
initialsLabel.textContent = "Enter your initials here: ";

var brEL = document.createElement("br");

//  Creating the input field for user to input initials

var initialInput = document.createElement("input");
initialInput.setAttribute("type", "text");
initialInput.setAttribute("class", "initials");
initialInput.textContent = "";

//  Creating the submit button for user to input initials
var initialSubmit = document.createElement("button");
initialSubmit.setAttribute("type", "submit");
initialSubmit.setAttribute("class", "Submit");
initialSubmit.textContent = "Submit";

//Function to triggers when the quiz is complete or when the timer hits zero
function complete() {
  questionsEl.innerHTML = "";
  timerEL.innerHTML = "";
  timerEL.style.display = "none";

  //Message that triggers when the timer is at zero
  if (secondsLeft >= 0) {
    var pEl = document.createElement("p");
    clearInterval(quizTimer);
    pEl.textContent = "End of quiz! You got  " + score + "/" + questionBank.length + " Correct!";

    questionsEl.appendChild(pEl);
  }
  //Append the input elements for the final page
  questionsEl.appendChild(initialsLabel);
  questionsEl.appendChild(brEL);
  questionsEl.appendChild(initialInput);
  questionsEl.appendChild(initialSubmit);

  //Event Listener for Submit button
  initialSubmit.addEventListener("click", function () {
    var initials = initialInput.value;

    if (initials === null || initials === "") {
      alert("Please enter your initials.");
    } else {
      var finalScore = {
        initials: initials,
        score: secondsLeft,
      };
      //Store the data from final score to local storage
      var scoreList = JSON.parse(localStorage.getItem("scoreList")) || [];
      // Adds the final score to the score list array
      scoreList.push(finalScore);
      var newScore = JSON.stringify(scoreList);
      localStorage.setItem("scoreList", newScore);
      createHighScorePage();
    }
  });
}

//Function to create the high score page
function createHighScorePage() {
  //Clear the question div
  questionsEl.innerHTML = "";
  timerEL.innerHTML = "";

  //Create new elements for the High Score Page
  var highScoreTitle = document.createElement("h1");
  highScoreTitle.setAttribute("class", "highScoreTitle");
  highScoreTitle.textContent = "High Scores";

  questionsEl.appendChild(highScoreTitle);

  var clearButton = document.createElement("button");
  clearButton.setAttribute("type", "reset");
  clearButton.setAttribute("class", "clearButton");
  clearButton.textContent = "Clear High Score";

  // Get data from local storage
  var scoreList = localStorage.getItem("scoreList");
  scoreList = JSON.parse(scoreList);

  //Print out all the high scores
  if (scoreList !== null) {
    for (var i = 0; i < scoreList.length; i++) {
      var scoreLi = document.createElement("li");
      scoreLi.setAttribute("class", "scoreLi");
      scoreLi.textContent = scoreList[i].initials + "'s High Score:  " + scoreList[i].score;
      questionsEl.appendChild(scoreLi);
    }
  }
  questionsEl.appendChild(clearButton);
  //Event listener to clear the high score page
  clearButton.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
  });
}
