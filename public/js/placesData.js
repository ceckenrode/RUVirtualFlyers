(function() {
  
  var data = [
    {
      name: 'quidoba',
      category: 'food'
    },
    {
      name: 'Henrys diner',
      category: 'food'
    }

  ];
  var template = Handlebars.compile($('#template').html());
  $('ul.places').append(data);
})();