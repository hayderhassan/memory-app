var inputs = [];
var currentInput = 0;

$( document ).ready(function() {

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
      if (currentInput === 2)
        checkNumbers();
      else
        inputs[currentInput].focus();
    }
  });


  $(".question-card").each(function( index ) {
    $(this).html(generateRandomNumber());
  });

  var counter = 5;

  var countdownTimer = function(){
      if(counter == 0){
        $("#countdown-text").html("Time up!", clearCards());
      } else {
        $("#countdown").html(counter);
          counter--;
          setTimeout(countdownTimer, 1000); // check again in a second
      }
  };
  countdownTimer();

});

function generateRandomNumber() {
  return randomNumber = Math.floor((Math.random() * 9) + 1);
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
