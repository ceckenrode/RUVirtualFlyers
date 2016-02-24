var Sequelize = require('sequelize');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var PORT = process.env.NODE_ENV || 3000;
var bcrypt = require('bcryptjs');
var session = require('express-session');
var express = require('express');
var app = express();
var PORT = process.env.NODE_ENV || 3000;
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

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    Users.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));

//change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, name: id });
});

var Users = connection.define ('user',{
  username : {
    type : Sequelize.STRING,
    unique : true,
    allowNull: false,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  },
  password: {
    type:Sequelize.STRING,
    unique:false,
    allowNull:false,
   }}, {
    hooks: {
      beforeCreate : function(input){
        input.password = bcrypt.hashSync(input.password,10);
      }
    }
});

var Places = connection.define ('places',{
  place : {
    type : Sequelize.STRING,
    unique : true,
    allowNull: false,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  }
});

var Ratings= connection.define ('ratings',{
  rating : {
    type : Sequelize.INTEGER,
    unique : true,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  },
  userComment: {
    type: Sequelize.STRING(65,535),
    unique : false,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  }
});

Ratings.belongsTo(Places, {foreignKey: 'fk_places'});

app.get('/',function(req,res){
  res.render('login',{msg:req.query.msg});
});

app.post('/save',function(req,res){
  Users.create(req.body).then(function(results){
    res.redirect('/?msg=Account Created');
  }).catch(function(err){
    res.redirect('/?msg='+ err.errors[0].message);
  });
});

app.post('/check', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/?msg=Login Credentials do not work'
}));

app.get('/home', function(req, res){
  res.send("Now the legit registered user is allowed to do stuff and this is their homepage");
});



// app.get('/', function(req, res) {
//   res.render('home');
// });

app.get('/index', function(req, res) {
  res.render('index');
});

app.get('/register', function(req, res) {
  res.render('register');
});

// app.get('/login', function(req, res) {
//   res.render('login');
// });


// force: true is for testing temporary data, could potentially wipe out an existing database once we create the official ones, so it will have to be removed at that point
connection.sync({ force: true }).then(function(){
  app.listen(PORT,function(){
    console.log("Application is listening on PORT %s",PORT);
  });
});
