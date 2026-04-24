const UserModel = require('../model/user-model');
const { md5Hash, generateToken } = require('../helpers/auth');
const { validateEmail, validatePassword } = require('../helpers/validation');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = md5Hash(password);
    const user = await UserModel.createUser({ name, email, password: hashedPassword });

    const token = generateToken(user._id);
    res.cookie('bloggerToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(201).json({ message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await UserModel.findUserByEmail(email);
    if (!user || user.password !== md5Hash(password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('bloggerToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('bloggerToken');
  res.json({ message: 'Logout successful' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await UserModel.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
