import express from 'express';
import passport from 'passport';
import { home, login, showlogin, showsignup, signup } from '../controller/authController.js';
import { isLoggedIn, isNotLoggedIn, DontHaveAnAccount } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', isNotLoggedIn, signup)
router.post('/login', isNotLoggedIn, login)
router.get('/showsignup', isNotLoggedIn, showsignup)
router.get('/showlogin', isNotLoggedIn, showlogin)
// Protected routes
router.get('/home', isLoggedIn, home)

// Google OAuth routes
router.get('/auth/google', isNotLoggedIn, (req, res, next) => {
  console.log('Starting Google OAuth...');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
  console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing');
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// Logout route in your controller or router
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/userauth/showlogin'); // redirect to login after logout
  });
});


// Debug route to check OAuth configuration
router.get('/debug-oauth', (req, res) => {
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  
  res.json({
    hasClientId,
    hasClientSecret,
    clientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0,
    clientSecretLength: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET.length : 0,
    callbackURL: "http://localhost:5000/auth/google/callback",
    message: hasClientId && hasClientSecret ? 'OAuth credentials are configured' : 'OAuth credentials are missing'
  });
});

export default router;