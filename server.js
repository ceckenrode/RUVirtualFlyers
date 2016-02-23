var Sequelize = require('sequelize');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var PORT = process.env.NODE_ENV || 3000;
var bcrypt = require('bcryptjs');
var session = require('express-session');
var express = require('express');
//requiring passport last
var passport = require('passport');
var passportLocal = require('passport-local');
var app = express();
var PORT = process.env.NODE_ENV || 3000;

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars',expressHandlebars({
  defaultLayout :'main'
}));

app.set('view engine','handlebars');


app.get('/', function(req, res) {
  res.render('index');
});


app.listen(PORT, function() {
  console.log("App listening on port %s", PORT);
});