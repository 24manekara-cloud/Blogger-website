const Post = require('../models/Post');
const Comment = require('../models/Comment');
const slugify = require('slugify');

// @route GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 6 } = req.query;
    const query = search ? { $text: { $search: search } } : {};
    
    const count = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      posts,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      totalPosts: count,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/posts/my-posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/posts/:id (or slug)
exports.getPost = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    const post = await Post.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    
    // Check for uniqueness
    let existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
    }

    const post = new Post({
      title,
      content,
      image,
      category,
      slug,
      author: req.user.id,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this post' });
    }

    const updateData = { ...req.body };
    if (updateData.title && updateData.title !== post.title) {
      let baseSlug = slugify(updateData.title, { lower: true, strict: true });
      updateData.slug = baseSlug;
      let existingPost = await Post.findOne({ slug: updateData.slug, _id: { $ne: post._id } });
      if (existingPost) {
        updateData.slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
      }
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user.id);
    if (isLiked) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: post._id,
    });

    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();

    const populatedComment = await Comment.findById(savedComment._id).populate('author', 'name avatar');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/posts/:id/comments/:comment_id
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.findById(req.params.comment_id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete comment' });
    }

    post.comments = post.comments.filter((c) => c.toString() !== req.params.comment_id);
    await post.save();
    await comment.deleteOne();

    res.json({ message: 'Comment removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
