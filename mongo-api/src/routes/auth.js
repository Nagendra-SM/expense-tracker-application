const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    // Generate auth token
    const token = user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    
    res.json({ 
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }, 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid login credentials' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

// Logout user (client should remove the token)
router.post('/logout', auth, async (req, res) => {
  // In a real app, you might want to implement token blacklisting here
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
