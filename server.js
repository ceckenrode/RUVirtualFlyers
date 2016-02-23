var express = require('express');
var app = express();
var PORT = process.env.NODE_ENV || 3000;

app.get('/', function(req, res) {
  res.send("Welcome home!");
});

app.get('/main', function(req, res) {
  res.send("This is the main page");
});

app.get('/register', function(req, res) {
  res.send("Please Register");
});

app.get('/login', function(req, res) {
  res.send("Login to submit reviews!");
});



app.listen(PORT, function() {
  console.log("App listening on port %s", PORT);
});