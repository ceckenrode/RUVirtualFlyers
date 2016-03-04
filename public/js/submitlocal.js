$(document).ready(function() {
$('.category ul li a').click(function(event) {
  $('.catbtn').text($(this).text());
  $('#category').val($(this).text());
});
});