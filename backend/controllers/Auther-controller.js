const AutherModel = require('../model/Auther-model');

exports.createAuther = async (req, res) => {
  try {
    const auther = await AutherModel.createAuther(req.body);
    res.status(201).json(auther);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllAuthers = async (req, res) => {
  try {
    const authers = await AutherModel.getAllAuthers();
    res.json(authers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAutherById = async (req, res) => {
  try {
    const auther = await AutherModel.getAutherById(req.params.id);
    if (!auther) return res.status(404).json({ message: 'Auther not found' });
    res.json(auther);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAuther = async (req, res) => {
  try {
    const auther = await AutherModel.updateAuther(req.params.id, req.body);
    res.json(auther);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAuther = async (req, res) => {
  try {
    await AutherModel.deleteAuther(req.params.id);
    res.json({ message: 'Auther deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
