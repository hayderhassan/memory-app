

// This code is to filter the input and select the next input box 

// Restricts input for each element in the set of matched elements to the given inputFilter.
(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  };
}(jQuery));

$('.number-input').inputFilter(function(value) {
  return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 9); 
});

$('.number-input').keyup(function(e) {
  var code = e.which;
  // Number key code for number row and key pad from this reference https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105))
    $(this).next('.number-input').focus();
});
