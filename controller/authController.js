import User from '../models/userModel.js';

export const signup = async(req,res)=>{
  try {
    const {username, email, password, usertype} = req.body;
    console.log('Signup attempt:', {username, email, usertype});
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.render('signup', { error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = await User.create({username, email, password, usertype});
    console.log('User created successfully:', newUser._id);
    
    res.redirect('/userauth/showlogin');
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific validation errors
    if (error.code === 11000) {
      return res.render('signup', { error: 'Email already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      return res.render('signup', { error: errorMessage });
    }
    
    res.render('signup', { error: 'Signup failed. Please try again.' });
    
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Password provided:', password ? 'Yes' : 'No');
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.render('login', { error: 'Invalid email or password' });
    }
    
    console.log('Login successful for user:', email);
    
    // Set up session for regular login
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.render('login', { error: 'Login failed. Please try again.' });
      }
      console.log('Session created successfully for user:', email);
      res.redirect('/userauth/home');
    });
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
};

export const showsignup = async (req,res)=>{
  res.render('signup', { error: null });
}

export const showlogin = async (req,res)=>{
  res.render('login', { error: null });
}

export const home = async (req,res)=>{
  try {
    console.log('Home page accessed by user:', req.user);
    res.render('home', { user: req.user });
  } catch (error) {
    console.error('Home page error:', error);
    res.redirect('/userauth/showlogin');
  }
}
 
