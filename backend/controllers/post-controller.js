const PostsModel = require('../model/posts-model');

exports.getMyPosts = async (req, res) => {
  try {
    const result = await PostsModel.getAllPosts({ author: req.user.id }, 0, 100);
    res.json(result.posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
