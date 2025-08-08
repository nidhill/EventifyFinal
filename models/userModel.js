import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is only required if not using Google OAuth
    }
  },
  usertype: {
    type: String,
    enum: ['attendee', 'creator'], 
    default: 'attendee'        
  },
  googleId: String,
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    try {
      console.log('Hashing password before save...');
      this.password = await bcrypt.hash(this.password, 10);
      console.log('Password hashed successfully');
    } catch (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function(pwd) {
  console.log('Comparing passwords...');
  console.log('Input password:', pwd);
  console.log('Stored password hash:', this.password);
  
  // If user has no password (Google OAuth user), return false
  if (!this.password) {
    console.log('No password stored for user');
    return false;
  }
  
  try {
    const result = await bcrypt.compare(pwd, this.password);
    console.log('Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

export default mongoose.model('User', userSchema);