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
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
  2: {
    "questions": [],
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
  3: {
    "questions": [],
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
  4: {
    "questions": [],
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
  5: {
    "questions": [],
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
  6: {
    "questions": [],
    "answers": [],
    "score": 0,
    "correct_order": false,
    "duration": 0
  },
};

var toNode = html => new DOMParser().parseFromString(html, 'text/html').body.firstChild;

var questionCard = '<div class="col-3 text-center">' +
                    '<div class="card d-flex number-card border-primary bg-primary mb-3">' +
                    '<div class="card-body align-items-center d-flex justify-content-center bg-primary">' +
                    '<p class="card-text question-card bg-primary number-input"></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

var correctSquare = '<i class="fas fa-square correct-square"></i>\n';
var incorrectSquare = '<i class="fas fa-square wrong-square"></i>\n';
var tick = '<i class="fas fa-check text-success"></i>';
var cross = '<i class="fas fa-times text-danger"></i>';

$(document).ready(function() {

  if (sessionStorage.hasOwnProperty("timer")) {
    $(":radio[value=" + sessionStorage.timer + "]").prop('checked', true);
  } else {
    sessionStorage.timer = 5;
    $('#five-seconds').prop('checked', true);
  }

  if (sessionStorage.hasOwnProperty("symbols")) {
    $(":radio[value=" + sessionStorage.symbols + "]").prop('checked', true);
  } else {
    sessionStorage.symbols = "numbers";
    $('#numbers').prop('checked', true);
  }

  $("#save-settings-button").click(function(){
    sessionStorage.timer = $("input[name='seconds']:checked").val();
    sessionStorage.symbols = $("input[name='symbols']:checked").val();
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  $("#exit-icon").click(function() {
    window.location.href = "index.html";
  });

  runGame();

  $("#next-button").click(function(){
    $(this).hide();
    goToNextLevel();
  });

});

function numberInputKeypress(e) {
//  A function to filter the input for number only
  // var letters = /^[A-Za-z]+$/;
  // if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
}

function numberInputKeyup(e) {
//  A function to change focus to the next input after keypress
  var code = e.which;
  // Number key code for number row and key pad from this reference https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
    currentInput++;
    $(this).attr("contenteditable", "false");
    if (currentInput === (2 * currentLevel)) {
      finishedLevel();
    } else {
      inputs[currentInput].focus();
    }
  }
}

function runGame() {
  $("#next-button").hide();
  showReport();
  showCurrentLevel();
  clearQuestions();
  showQuestions();
  $("#game-info").html("Memorise the items below.");
  var counter = parseInt(sessionStorage.timer);
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
}

function showCurrentLevel() {
  $("#current-level").html("Level " + sessionStorage.level);
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 10);
}

function generateRandomLetter() {
  var code = Math.floor(Math.random() * 26) + 65;
  return String.fromCharCode(code);
}

function generateRandomNumberOrLetter() {
  var random = Math.floor(Math.random() * 101);
  if (random >= 50) {
    return generateRandomNumber();
  }
  return generateRandomLetter();
}

function generateQuestion() {
  if (sessionStorage.symbols == "numbers") {
    return generateRandomNumber();
  } else if (sessionStorage.symbols == "letters") {
    return generateRandomLetter();
  } else {
    return generateRandomNumberOrLetter();
  }
}

function clearCards() {
  $(".question-card").each(function( index ) {
    $(this).html("");
    $(this).attr("contenteditable", "true");
    inputs.push($(this));
  });
  inputs[currentInput].focus();
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
  checkAnswers();
  if (sessionStorage.level == 6) {
    showReport();
  } else {
    showReport();
    sessionStorage.level++;
    runGame();
  }
}

function clearQuestions() {
  inputs = [];
  currentInput = 0;
  var cards = document.getElementById("qcards");
  if (cards.hasChildNodes())
    while (cards.firstChild)
      cards.removeChild(cards.firstChild);
}

function showQuestions() {
  var numberOfQuestions = 2 * sessionStorage.level;
  for (var i = 0; i < numberOfQuestions; i++) {
    var card = toNode(questionCard);

    $(card).keypress(function(e) {
      numberInputKeypress(e);
    });

    $(card).keyup(function(e) {
      numberInputKeyup(e);
    });

    document.getElementById("qcards").appendChild(card);
  }
  $(".question-card").each(function( index ) {
    var question = generateQuestion();
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
  saveDuration(seconds);
  totalTime += seconds;
}

function saveDuration(duration) {
  levels[sessionStorage.level].duration = duration;
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
  // alert(results);
  populateTable();
}

function storeAnswers() {
  $(".question-card").each(function( index ) {
    var answer = $(this).html();
    levels[sessionStorage.level]["answers"].push(answer);
  });
}

function test() {
  var results = "";
  for (var level in levels) {
    var obj = levels[level];
    for (var prop in obj) {
        results += level + ": " + prop + " = " + obj[prop] + "\n";
    }
  }
}

function checkAnswers() {
  var q = levels[sessionStorage.level]["questions"];
  var a = levels[sessionStorage.level]["answers"];
  if (isSameOrder(q,a)) {
    levels[sessionStorage.level]["correct_order"] = true;
    levels[sessionStorage.level]["score"] = 2 * sessionStorage.level;
  } else {
    calcScore(q, a);
  }
    alert("Score = " + levels[sessionStorage.level]["score"]);
}

function isSameOrder(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(parseInt(arr1[i]) !== parseInt(arr2[i]))
            return false;
    }
    return true;
}

function calcScore(questions, answers) {
  var q = questions.sort(function(a, b){return a - b});
  var a = answers.sort(function(a, b){return a - b});
  // for(var i = questions.length; i--;) {
  //     if(parseInt(q[i]) == parseInt(a[i])) {
  //       var current = levels[sessionStorage.level]["score"];
  //       levels[sessionStorage.level]["score"] = parseInt(current) + 1;
  //     }
  // }
//   alert("Level " + sessionStorage.level);
// alert("q = " + q);
// alert("a = " + a);
  for (var i = 0; i < q.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (parseInt(q[i]) === parseInt(a[j])) {
        // alert("removing " + a[j]);
        a.splice(i,1);
        // alert("q = " + q + "\na = " + a);
        // alert("a = " + a);
        var current_score = levels[sessionStorage.level]["score"];
        // alert("Current score = " + current_score);
        levels[sessionStorage.level]["score"] = parseInt(current_score) + 1;
        break;
      }
    }
  }

}

function populateTable() {
  var results = "";
  for (var level in levels) {
    var lev = levels[level];
    // for (var prop in lev) {
    //     results += level + ": " + prop + " = " + lev[prop] + "\n";
    //     alert(lev["score"]);
    // }
    var squares = "";
    for (var i = 0; i < parseInt(lev["score"]); i++) {
      squares += correctSquare;
    }
    var score = parseInt(lev["score"]);
    while (score < (parseInt(level) * 2)) {
      squares += incorrectSquare;
      score++;
    }
    $("#" + level).next().html(squares);
    if (lev["correct_order"]) {
      $("#" + level).next().next().html(tick);
    } else {
      $("#" + level).next().next().html(cross);
    }
    $("#" + level).next().next().next().html(lev["duration"]);
  }
}
