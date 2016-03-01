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

app.use(session({
    secret: 'quackbird noodletown',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14
    }
}));


app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/images", express.static("public/images"));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//var connection = new Sequelize ('rutgersLocations','root');
require('dotenv').config();
var connection = new Sequelize(process.env.JAWSDB_URL);
app.use(bodyParser.urlencoded({
    extended: false
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
        if (user) {
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                    //if password is correct authenticate the user with cookie
                    done(null, { id: username, username: username });
                } else {
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

var Users = connection.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    password: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        validate: {
            len: {
                args: [5, 10],
                msg: "Your password must be between 5-10 characters"
            },

            // isUppercase: true

        }
    }
}, {
    hooks: {
        beforeCreate: function(input) {
            input.password = bcrypt.hashSync(input.password, 10);
        }
    }
});

var Places = connection.define ('place',{
  place : {
    type : Sequelize.STRING,
    unique : true,
    allowNull: false,
    updatedAt: 'last_update',
    createdAt: 'date_of_creation',
    address: 'Sequelize.STRING',
    phoneNumber: Sequelize.INTEGER,
    description: Sequelize.STRING(160)
  }
});

var Ratings = connection.define('rating', {
    rating: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    userComment: {
        type: Sequelize.STRING(65, 535),
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    category: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    }
});


Ratings.belongsTo(Places, { foreignKey: 'fk_places' });

app.get('/', function(req, res) {
    res.render('home', { msg: req.query.msg, user: req.user });
});

app.post('/save', function(req, res) {
    Users.create(req.body).then(function(results) {
        res.redirect('/?msg=Account Created');
    }).catch(function(err) {
        res.redirect('/?msg=' + err.errors[0].message);
    });
});

app.post('/check', passport.authenticate('local', {
    successRedirect: '/feed',
    failureRedirect: '/?msg=Login Credentials do not work'
}));

app.get('/home', function(req, res) {
    res.render('home', { user: req.user });
});
app.get('/feed', function(req, res) {
    res.render('feed', { user: req.user });
});

app.get('/rate', function(req, res) {
    res.render('rate', { msg: req.query.msg, user: req.user });

app.post('/rate',function(req,res){
  Ratings.create(req.body).then(function(place){
    res.redirect('/?msg=Rated');
  }).catch(function(err){
    res.redirect('/?msg='+ err.errors[0].message);
  });
});

});
app.get('/submitlocation', function(req, res) {
    res.render('submitlocation', { msg: req.query.msg, user: req.user });
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/location', function(req, res) {
    res.render('location');
});


app.post('/submitlocation', function(req, res) {
    res.redirect('/feed');
});

// force: true is for testing temporary data, could potentially wipe out an existing database once we create the official ones, so it will have to be removed at that point
connection.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Application is listening on PORT %s", PORT);
    });
});