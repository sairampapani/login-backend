// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (cleaned up)
mongoose.connect('mongodb://127.0.0.1:27017/loginApp')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Register API
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User Registered' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ error: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ message: 'Login Successful' });
    } else {
      res.status(401).json({ error: 'Invalid Credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
