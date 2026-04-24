const PostsModel = require('../model/posts-model');

exports.createPost = async (req, res) => {
  try {
    const post = await PostsModel.createPost({ ...req.body });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const skip = (Number(page) - 1) * Number(limit);
    
    const result = await PostsModel.getAllPosts(query, skip, Number(limit));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await PostsModel.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await PostsModel.updatePost(req.params.id, req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await PostsModel.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
