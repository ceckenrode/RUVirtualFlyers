$(document).ready(function() {
  $('#submitSignup').click(function(event) {
    if ($('#password').val() !== $('#reenterPassword').val()){
      event.preventDefault();
      bootbox.alert('Your passwords do not match, try again.');
    } else if ($('#nameInput').val() === '' || $('#password').val() === '') {
      event.preventDefault();
      bootbox.alert('Please complete all of the required fields.');
    }
  });
});