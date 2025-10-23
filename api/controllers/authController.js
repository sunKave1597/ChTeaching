const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  let { name, email, password, age } = req.body;
  try {
    emailLower = email.toLowerCase().trim();
    const exists = await User.findOne({ email : emailLower });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const user = await User.create({ name, email: emailLower, password, age });
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const emailLower = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
