const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(profile.emails[0].value);
    
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // Create new user from Google profile
    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      google_id: profile.id,
      college: 'Not specified',
      skills: [],
      github_link: ''
    });
    
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
  callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = null;
    if (profile.emails && profile.emails.length > 0) {
      existingUser = await User.findByEmail(profile.emails[0].value);
    }
    
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // Create new user from GitHub profile
    const newUser = await User.create({
      name: profile.displayName || profile.username,
      email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.local`,
      github_id: profile.id,
      college: 'Not specified',
      skills: [],
      github_link: profile.profileUrl || `https://github.com/${profile.username}`
    });
    
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
