const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllPosts,
  getMyPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/my-posts', auth, getMyPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.put('/:id/like', auth, likePost);
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:comment_id', auth, deleteComment);

module.exports = router;
