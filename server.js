var Sequelize = require('sequelize');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var PORT = process.env.NODE_ENV || 3000;
var bcrypt = require('bcryptjs');
var session = require('express-session');
var express = require('express');
var app = express();

var passport = require('passport');
var passportLocal = require('passport-local');


app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var connection = new Sequelize ('rutgersLocations','root');

app.use(bodyParser.urlencoded({
  extended :false
}));

app.use(session({
  secret: 'quackbird noodletown',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

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