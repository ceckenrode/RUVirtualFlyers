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


var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb) {
        var num;
        Places.findAndCountAll().then(function(result) {
            num = result.count + 1;
        }).then(function() {
            cb(null, "image" + num + "." + (file.mimetype).split('/')[1])
        })


    }
})




var upload = multer({
    limits: {
        fileSize: 4000000,
        files: 1
    },
    storage: storage
});
var uploadd = multer().single('image')

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
app.use("/uploads", express.static("public/uploads"));

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
                    done(null, {
                        id: username,
                        username: username
                    });
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
    done(null, {
        id: id,
        name: id
    });
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

var Places = connection.define('place', {
    place: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    address: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    phoneNumber: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },

    description: {
        type: Sequelize.STRING(160),
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    image: {
        type: Sequelize.STRING,
        unique: false,
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
    },
    keywords: {
        type: Sequelize.STRING(20),
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    }
});

var Ratings = connection.define('rating', {
    rating: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    userComment: {
        type: Sequelize.STRING(600),
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    },
    username: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    }
});

var Images = connection.define('image', {
    imgFilePath: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    }
});


Places.hasMany(Ratings);
Users.hasMany(Ratings);

app.get('/', function(req, res) {
    res.render('home', {
        msg: req.query.msg,
        user: req.user
    });
});

app.post('/save', function(req, res) {
    Users.create(req.body).then(function(results) {
        res.redirect('/registered');
    }).catch(function(err) {
        res.redirect('/?msg=' + err.errors[0].message);
    });
});

app.post('/check', passport.authenticate('local', {
    successRedirect: '/feed',
    failureRedirect: '/?msg=Login Credentials do not work'
}));

app.get('/home', function(req, res) {
    res.render('home', {
        user: req.user
    });
    console.log(req.user);
});
app.get('/feed', function(req, res) {

    Places.findAll().then(function(places) {
        res.render('feed', {
            user: req.user,
            places: places
        });
    })
});

app.get('/feed/:category', function(req, res) {
    Places.findAll({
        where: {
            category: req.params.category
        }
    }).then(function(places) {
        if (places.length === 0) {
            res.render('feed', {
                user: req.user,
                places: places,
                emptymsg: "There don't seem to be any submissions for this category yet."
            });
        } else {
            res.render('feed', {
                user: req.user,
                places: places
            });
        }

    })
});

app.get('/feed/location/:locationid', function(req, res) {

    Places.findOne({
        where: {
            id: req.params.locationid
        }
    }).then(function(place) {
        if (place !== null) {
            Ratings.findAll({
                where: {
                    placeId: req.params.locationid
                }
            }).then(function(rating) {
                if (rating !== null) {
                    res.render('locationdetailed', { user: req.user, place: place, rating: rating, numReviews: rating.length });
                } else {
                    res.render('locationdetailed', { user: req.user, place: place });
                }

            })

        } else {
            res.render('locationdetailed', { user: req.user, emptymsg: "There seems to have been an error, this place doesn't exist in our database." });
        }

    });
});

app.get('/registered', function(req, res) {
    res.render('registered', {
        user: req.user
    });
});

// app.get('/rate', function(req, res) {
//   res.render('rate', {
//     msg: req.query.msg,
//     user: req.user
//   });



// });
app.post('/rate', function(req, res) {
    Users.findOne({
        where: {
            username: req.user.id
        }
    }).then(function(user) {
        Ratings.create({
            rating: req.body.rating,
            userComment: req.body.comment,
            userId: user.id,
            placeId: req.body.placeId,
            username: user.username
        }).then(function() {
            res.redirect('/feed');
        })
    })
});

Ratings.findAndCountAll({
    where: {
        rating: {
            $ne: null

        }
    }
}).then(function(result) {
    var denominator = result.count * 5;

    Ratings.sum('rating').then(function(sum) {
        var decimal = Math.round(sum * 100 / denominator) / 100;
        console.log(decimal);
        console.log(sum);
        console.log(denominator);

    });

});

app.get('/submitlocation', function(req, res) {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.render('submitlocation', {
            msg: req.query.msg,
            user: req.user
        });
    }
});

app.post('/submitlocation', upload.single('image'), function(req, res) {
    if (req.file !== undefined) {
        var imgpath = req.file.path;
        var newurl = [];
        for (var i = 7; i < imgpath.length; ++i) {
            newurl.push(imgpath[i]);
        }
        newurl = newurl.join('');

        Places.create({
            place: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phone,
            description: req.body.description,
            image: newurl,
            category: req.body.category,
            keywords: req.body.keywords
        }).then(function() {
            res.redirect('/feed');
        });
    } else {
        Places.create({
            place: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phone,
            description: req.body.description,
            image: 'uploads/placehold.png',
            category: req.body.category,
            keywords: req.body.keywords
        }).then(function() {
            res.redirect('/feed');
        });
    }
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

app.get('/usersreview', function(req, res) {
    var theirs = {};
    if (req.user) {
        theirs = {
            where: {
                userId: req.user.id
            }
        };
    }
    Ratings.findAll(theirs).then(function(reviews) {
        res.render('userreviews', {
            reviews: reviews
        });
    });
});


app.post('/userreviewedit/:id', function(req, res) {

    Ratings.update({
        rating: req.body.rating,
        userComment: req.body.textarea
    }, {
        where: { id: req.params.id }
    }).then(function(userupdate) {
        res.redirect('/?msg=rating edited');
    }).catch(function(err) {
        console.log(err);
        res.redirect('/?msg=' + err.message);
    });
});



// force: true is for testing temporary data, could potentially wipe out an existing database once we create the official ones, so it will have to be removed at that point
connection.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Application is listening on PORT %s", PORT);
    });
});
