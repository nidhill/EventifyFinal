


import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"

}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if required environment variables are set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials in environment variables');
      return done(new Error('OAuth credentials not configured'), null);
    }

    // 1. Check if Google user already exists
    let existingUser = await User.findOne({ googleId: profile.id });

    // 2. If not, create a new user
    if (!existingUser) {
      existingUser = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails?.[0]?.value,
        password: '',        // No password for Google users
      });
    }

    // 3. Pass user to session
    return done(null, existingUser);
  } catch (err) {
    console.error('Passport strategy error:', err);
    return done(err, null);
  }
}));

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id); // MongoDB _id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});