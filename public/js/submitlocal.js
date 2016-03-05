$(document).ready(function() {

$('.category ul li a').click(function(event) {
  $('.catbtn').text($(this).text());
  $('#locationCategory').val($(this).text());
  console.log('saved');
});

$('.submit').click(function(event) {
  if ($('#locationName').val() === '' || $('#locationAddress').val() === '' || $('#locationPhoneNumber').val() === '' ||
    $('#locationDescription').val() === '' || $('#locationCategory').val() === '' || $('#locationPhoneNumber').val() === "+1 " || 
    $('#locationPhoneNumber').val().length !== 17 )
  {
    bootbox.alert('You must complete all of the required fields before proceeding.');
  event.preventDefault();
  }
});
});