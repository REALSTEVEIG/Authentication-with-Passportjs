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

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// app.use('/', indexRouter);
app.use('/users', usersRouter)

// Basic Authentication for session and cookies
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.send('Please login')
    }
  }

  app.get('/users/welcome', isLoggedIn, (req, res) => {
    console.log(req.isAuthenticated())
    console.log(req.user)
    res.json({message : 'Welcome Steve', user : req.user})
})


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