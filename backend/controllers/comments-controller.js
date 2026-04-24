const CommentModel = require('../model/comment-model');

exports.createComment = async (req, res) => {
  try {
    const comment = await CommentModel.createComment({ ...req.body, author: req.user.id });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const comments = await CommentModel.getCommentsByPostId(req.params.postId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await CommentModel.getAllComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCommentStatus = async (req, res) => {
  try {
    const comment = await CommentModel.updateCommentStatus(req.params.id, req.body.status);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await CommentModel.deleteComment(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
