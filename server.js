var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var PORT = process.env.NODE_ENV || 3000;

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/index', function(req, res) {
  res.render('index');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/login', function(req, res) {
  res.render('login');
});



app.listen(PORT, function() {
  console.log("App listening on port %s", PORT);
});