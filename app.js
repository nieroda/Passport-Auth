var express                 = require('express'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    User                    = require('./models/user'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    session                 = require('express-session'),
    MongoStore              = require('connect-mongo')(session);

mongoose.connect("mongodb://", {
  useMongoClient: true
});

var app = express();

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: false,
    secret: 'this is a secret'
}));

/*
app.use(require('express-session')({
    secret: "This is a secret?",
    resave: false,
    saveUninitialized: false
}));
*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes


app.get('/', (req, res) => {
  console.log(req.session.cookie.maxAge);
  console.log(req.session);
   res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
    User.find({}, (err, result) => {
      console.log(err);
      console.log(result);
    });
    console.log(req.session);
    res.render('secret');
});

//Auth Routes

//show sign up form
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
   User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, (err, user) => {
      if(err) {
          console.log(err);
          return res.render('register');
      }
      passport.authenticate('local')(req, res, () => {
         res.redirect('/secret');
      });
   });
});

//LOGIN ROUTES
//RENDER Login Form
app.get('/login', (req, res) => {
    res.render('login');
});

//login logic

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {

});

app.get('/logout', (req, res) => {
  console.log(req);
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.listen(3000, () => {
    console.log('Server Started');
});
