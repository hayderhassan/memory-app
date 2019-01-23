var inputs = [];
var currentInput = 0;
var currentLevel = 1;
var startTime;
var endTime;
var totalTime = 0;
sessionStorage.level = 1;

var levels = {
  1: {
    "questions": [],
    "answers": []
  },
  2: {
    "questions": [],
    "answers": []
  },
  3: {
    "questions": [],
    "answers": []
  },
  4: {
    "questions": [],
    "answers": []
  },
  5: {
    "questions": [],
    "answers": []
  },
  6: {
    "questions": [],
    "answers": []
  },
};

var questionCard = '<div class="col text-center">' +
                    '<div class="card d-flex number-card border-primary bg-primary mb-3">' +
                    '<div class="card-body align-items-center d-flex justify-content-center bg-primary">' +
                    '<p class="card-text question-card bg-primary number-input"></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

$(document).ready(function() {

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  $("#exit-icon").click(function() {
    window.location.href = "index.html";
  });

// This code is to filter the input and select the next input box

 $('.number-input').keypress(function(e) {
//  A function to filter the input for number only
    if (isNaN(String.fromCharCode(e.which))  ) e.preventDefault();
  });

  $('.number-input').keyup(function(e) {
//  A function to change focus to the next input after keypress
    var code = e.which;
    // Number key code for number row and key pad from this reference https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) {
      currentInput++;
      $(this).attr("contenteditable", "false");
      if (currentInput === (2 * currentLevel)) {
        checkNumbers();
        finishedLevel();
      } else {
        inputs[currentInput].focus();
      }
    }
  });

  runGame();

  $("#next-button").click(function(){
    $(this).hide();
    goToNextLevel();
  });

});

function runGame() {
  $("#next-button").hide();
  showCurrentLevel();
  showQuestions();
  $("#game-info").html("Memorise the items below.");
  var counter = 5;
  var countdownTimer = function(){
      if(counter == 0){
        $("#timer").html("0", clearCards());
        $("#game-info").html("Type what you can remember.");
        startWatch();
      } else {
        $("#timer").html(counter);
          counter--;
          setTimeout(countdownTimer, 1000); // check again in a second
      }
  };
  countdownTimer();
};

function showCurrentLevel() {
  $("#current-level").html("Level " + sessionStorage.level);
};

function generateRandomNumber() {
  return Math.floor(Math.random() * 10);
};

function clearCards() {
  $(".question-card").each(function( index ) {
    $(this).html("");
    $(this).attr("contenteditable", "true");
    inputs.push($(this));
  });
  inputs[currentInput].focus();
}

function checkNumbers() {
// A function to check if the numbers entered were the same
}

function finishedLevel() {
    stopWatch();
    if (sessionStorage.level == 6) {
      $("#game-info").html("Good job! Click the button below to see your results.");
    } else {
      currentLevel++;
      $("#game-info").html("Click the button below when you're ready to take on Level " + (parseInt(sessionStorage.level) + 1));
    }
    showNextButton();
}

function showNextButton() {
  if (sessionStorage.level == 6) {
    $("#next-button").html("See your results!");
  } else {
    $("#next-button").html("Go to Level " + (parseInt(sessionStorage.level) + 1));
  }
  $("#next-button").show();
}

function goToNextLevel() {
  storeAnswers();
  if (sessionStorage.level == 6) {
    showReport();
  } else {
    sessionStorage.level++;
    runGame();
  }
}

function showQuestions() {
  var numberOfQuestions = 2 * sessionStorage.level;
  // for (var i = 0; i < numberOfQuestions; i++) {
  //   // $(questionCard).insertAfter("#question-section");
  //   // $("#questions").append(questionCard);
  // }
  $(".question-card").each(function( index ) {
    var question = generateRandomNumber();
    $(this).html(question);
    levels[sessionStorage.level]["questions"].push(question);
  });
}

function startWatch() {
  startTime = new Date();
}

function stopWatch() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  var seconds = Math.round(timeDiff / 1000);
  totalTime += seconds;
}

function showReport() {
  $("#game-screen").hide();
  $("#report-screen").show();
  var results = "";
  for (var level in levels) {
    var obj = levels[level];
    for (var prop in obj) {
        results += level + ": " + prop + " = " + obj[prop] + "\n";
    }
  }
  alert(results);
}

function storeAnswers() {
  $(".question-card").each(function( index ) {
    var answer = $(this).html();
    levels[sessionStorage.level]["answers"].push(answer);
  });
}
