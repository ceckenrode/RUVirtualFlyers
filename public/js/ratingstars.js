$(document).ready(function() {
  $('#one').mouseover(function(){
    $('#two').removeClass('fa-star').addClass('fa-star-o');
    $('#three').removeClass('fa-star').addClass('fa-star-o');
    $('#four').removeClass('fa-star').addClass('fa-star-o');
    $('#five').removeClass('fa-star').addClass('fa-star-o');
    $('#rating').val(1);
  });
  $('#two').mouseover(function(){
    $('#two').removeClass('fa-star-o').addClass('fa-star');
    $('#three').removeClass('fa-star').addClass('fa-star-o');
    $('#four').removeClass('fa-star').addClass('fa-star-o');
    $('#five').removeClass('fa-star').addClass('fa-star-o');
    $('#rating').val(2);
  });
  $('#three').mouseover(function(){
    $('#two').removeClass('fa-star-o').addClass('fa-star');
    $('#three').removeClass('fa-star-o').addClass('fa-star');
    $('#four').removeClass('fa-star').addClass('fa-star-o');
    $('#five').removeClass('fa-star').addClass('fa-star-o');
    $('#rating').val(3);
  });
  $('#four').mouseover(function(){
    $('#two').removeClass('fa-star-o').addClass('fa-star');
    $('#three').removeClass('fa-star-o').addClass('fa-star');
    $('#four').removeClass('fa-star-o').addClass('fa-star');
    $('#five').removeClass('fa-star').addClass('fa-star-o');
    $('#rating').val(4);
  });
  $('#five').mouseover(function(){
    $('#two').removeClass('fa-star-o').addClass('fa-star');
    $('#three').removeClass('fa-star-o').addClass('fa-star');
    $('#four').removeClass('fa-star-o').addClass('fa-star');
    $('#five').removeClass('fa-star-o').addClass('fa-star');
    $('#rating').val(5);
  });

  $('.reviewHead').each(function(index, el) {
    var stars = $(this).children('input').val();
    $(this).empty();

     for (var i = 0; i < stars; i++) {
       $(this).append("<i class='fa fa-star'></i>")
     }
  });
  
});