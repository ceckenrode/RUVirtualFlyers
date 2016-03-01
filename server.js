var Sequelize = require('sequelize');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var bcrypt = require('bcryptjs');
var session = require('express-session');
var express = require('express');
var app = express();
var passport = require('passport');
var passportLocal = require('passport-local');

var route = require('./routing');

function ensureAuthenticated(req, res, next) {
  if (req.user.isAuthenticated())
    return next();
  else
 res.redirect('/login');
}


app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/images", express.static("public/images"));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var connection = new Sequelize ('rutgers_locations','root');
require('dotenv').config();
// var connection = new Sequelize(process.env.JAWSDB_URL);
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

//table for signed up users 
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
    validate: {
      len: {
        args: [5,10],
        msg: "Your password must be between 5-10 characters"
      },
      // isUppercase: true
    }
   }}, {
    hooks: {
      beforeCreate : function(input){
        input.password = bcrypt.hashSync(input.password,10);
      }
    }
});
//end table for signed up users 

//table for venues 
var Places = connection.define ('place',{
  place : {
    type : Sequelize.STRING,
    unique : true,
    allowNull: false,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  },
  address: {  
    type: Sequelize.STRING,
    unique : true,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  },
  phoneNumber:{
    type: Sequelize.INTEGER,
    unique : true,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  },
    
  description:{ 
    type: Sequelize.STRING(160),
    unique : false,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  }
});
//end table for venues 

//table for ratings 
var Ratings= connection.define ('rating',{
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
  },
    category: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  }
});
//end table for ratings 

//images paths table
var Images = connection.define('image',{
  imgFilePath: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation'
  }
});
//end image path table 



//location/id: << feed/post/id looks for req.params.id = primaryIdkey(a database item) res.render that data on this view. then()button is a post posts reviews but links it with foreign key
//get math for average ratings 
Ratings.belongsTo(Places);
Images.belongsTo(Places);

//Ratings.belongsTo(Places);

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
  res.render("home");
});

app.get('/rate', function(req, res){
  res.render("rate", {layout:'rate'});
});

app.post('/rate',function(req,res){
  Ratings.create(req.body).then(function(place){
    res.redirect('/?msg=Rated');
  }).catch(function(err){
    res.redirect('/?msg='+ err.errors[0].message);
  });
});

// Places.bulkCreate([
//   {place:'Henrys'},
//   {place:"Quidoba"},
//   {place:"Quickcheck"},
//   {place:"Chipotle"}
// ]);

// Images.bulkCreate([
//   {imgFilePath: './public/images/henrysDiner.png'},
//   {imgFilePath: './public/images/quidoba.jpg'},
//   {imgFilePath: './public/images/quickcheck.jpg'},
//   {imgFilePath: './public/images/quickcheck.jpg'}
// ]);

// app.post('/check', passport.authenticate('local', {
//     successRedirect: '/home',
//     failureRedirect: '/?msg=Login Credentials do not work'
// }));



// app.post('/rate',
//   passport.authenticate('local'),
//  function(req, res) {
//   if(req.user.isAuthenticated()) {
//     place.create(req.body).then(function(res){
//     res.redirect('/?msg=thanks for rating,' +req.users.username);
//   });
//   } else {
//   res.send('log in to rate');
//   }
// });



// app.get('/account', ensureAuthenticated, function(req, res) {
//   res.render("rate");
// });

// app.post('/saveRating',function(req,res){
//   Ratings.create(req.body).then(function(results){
//     res.redirect('/?msg=Thanks for Rating!');
//   }).catch(function(err){
//     res.redirect('/?msg='+ err.errors[0].message);
//   });
// });

// app.get('/home', function(req, res){
//   res.render("home");
// });




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
connection.sync({force:true}).then(function(){
  app.listen(PORT,function(){
    console.log("Application is listening on PORT %s",PORT);
  });
});

