import express from 'express'
import dotenv from 'dotenv'
import connectTodbs from './db.js'
import router from './routes/authRoute.js'
import session from 'express-session'
import ejs from 'ejs'
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import './config/passport.js';


dotenv.config() 
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
connectTodbs()

// Session configuration
app.use(session({
  secret: process.env.secretkey || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/userauth', router)

// Google OAuth callback route (at root level to match Google Console)
app.get('/auth/google/callback', (req, res, next) => {
  console.log('Google callback received at root level');
  passport.authenticate('google', {
    failureRedirect: '/userauth/showlogin',
    failureFlash: true
  })(req, res, next);
}, (req, res) => {
  console.log('Google OAuth successful');
  console.log('User authenticated:', req.user);
  
  // Successful login
  res.redirect('/userauth/home');
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/userauth/showlogin');
});


app.get('/about', (req, res) => {
    res.render('about'); 
});


app.get('/events', (req, res) => {
    res.render('events'); 
});

app.get('/eventsDetails', (req, res) => {
    res.render('eventsDetails'); 
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, ()=>{
    console.log(`server is running on localhost ${port}`);
})
  