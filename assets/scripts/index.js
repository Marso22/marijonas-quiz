import { generateQuestion } from "./generateQuestion.js";
import { showScorePage } from "./showScorePage.js";
import { populateQuestion } from "./populateQuestion.js";
import {
  startLayout,
  quizLayout,
  endLayout,
  startBtn,
  quizBtns,
  retryBtn,
  answerFeedbackElement,
} from "./elementRefs.js";

function showSpinner() {
  document.getElementById('spinner-overlay').style.display = 'flex';
}
function hideSpinner() {
  document.getElementById('spinner-overlay').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log(cats, dogs, "cats and dogs");
  // console.log(getImage("breed", "cats"), "getImage");

  function showLayout(layoutToShow) {
    startLayout.style.display = "none";
    quizLayout.style.display = "none";
    endLayout.style.display = "none";
    layoutToShow.style.display = "block";
    // Footer is always visible, so no need to toggle it
  }

  // init score
  let score = 0;
  let questionCount = 1;
  let currentQuestion = null;

  // Show start-layout at the beginning
  showLayout(startLayout);

  // a function for generating and displaying the next question
  async function nextQuestion() {
    const question = await generateQuestion();
    currentQuestion = question;
    populateQuestion(question, questionCount);
  }

  // User starts the quiz
  startBtn.addEventListener("click", async () => {
    showSpinner();
    await nextQuestion();
    showLayout(quizLayout);
    hideSpinner();
  });

  // handle question answer
  quizBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      // get the index of the users chosen answer
      const answerIndex = Number(event.target.dataset.answerIndex);
      const correctAnswerIndex = currentQuestion.options.indexOf(
        currentQuestion.answer
      );
      const isAnswerCorrect = correctAnswerIndex === answerIndex;

      if (isAnswerCorrect) {
        // add 'correct' class to button
        event.target.classList.add("correct");
        // add 'correct' message to the page
        answerFeedbackElement.textContent = "Correct!!";
        answerFeedbackElement.style.color = "green";
        score++;
      } else {
        // add 'wrong' class to button
        event.target.classList.add("wrong");
        // add correct class to the correct answer button
        quizBtns[correctAnswerIndex].classList.add("correct");
        // add 'wrong' message to the page
        answerFeedbackElement.textContent = "Wrong!!";
        answerFeedbackElement.style.color = "red";
      }
      questionCount++;
        // Show feedback for 1 second, then show spinner for 2 seconds
    setTimeout(() => {
      showSpinner();
      setTimeout(async () => {
        if (questionCount <= 10) {
          await nextQuestion();
          hideSpinner();
        } else {
          showLayout(endLayout);
          showScorePage(score);
          hideSpinner();
        }
      }, 2000); // spinner shows for 2 seconds
    }, 1000); // feedback shows for 1 second before spinner
  });
});

  retryBtn.addEventListener("click", () => {
    // reset quiz
    score = 0;
    questionCount = 1;
    showLayout(startLayout);
  });
});
