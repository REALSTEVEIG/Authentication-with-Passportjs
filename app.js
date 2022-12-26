require('dotenv').config()

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const port = 3000

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const usersRouter = require('./routes/user')
const path = require('path')

const session = require('express-session');	//To Acquire it

app.use(session({ 		//Usuage
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/users/welcome', (req, res) => {
    console.log(req.user)
    res.json({message : 'Welcome Steve', user : req.user})
})


// Basic Authentication for session and cookies
function auth (req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()