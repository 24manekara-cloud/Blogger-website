import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost, likePost, addComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import './PostDetail.css';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', commentId: null });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPost(slug);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch post. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const executeDelete = async () => {
    if (deleteModal.type === 'post') {
      try {
        await deletePost(post._id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete post');
      }
    } else if (deleteModal.type === 'comment') {
      try {
        await deleteComment(post._id, deleteModal.commentId);
        setPost({ ...post, comments: post.comments.filter((c) => c._id !== deleteModal.commentId) });
        setDeleteModal({ isOpen: false, type: '', commentId: null });
      } catch (err) {
        alert('Failed to delete comment');
      }
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await likePost(post._id);
      setPost({ ...post, likes: data });
    } catch (err) {
      alert('Failed to like post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      const { data } = await addComment(post._id, commentText);
      setPost({ ...post, comments: [data, ...post.comments] });
      setCommentText('');
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };



  if (loading) return <Loader />;
  if (error) return <div className="error-msg page-container">{error}</div>;
  if (!post) return <div className="error-msg page-container">Post not found.</div>;

  const isAuthor = user && post.author && user._id === post.author._id;
  const isLiked = user && post.likes.includes(user._id);

  return (
    <div className="post-detail-page">
      <div className="post-detail-header">
        <span className="post-category-badge">{post.category}</span>
        <h1 className="post-detail-title">{post.title}</h1>
        
        <div className="post-meta">
          <div className="meta-author">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt="Author" className="meta-avatar" />
            ) : (
              <div className="meta-avatar-placeholder">{post.author?.name?.charAt(0) || '?'}</div>
            )}
            <div>
              <p className="meta-name">{post.author?.name || 'Unknown Author'}</p>
              <p className="meta-date">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {isAuthor && (
            <div className="meta-actions">
              <Link to={`/edit/${post._id}`} className="btn-secondary btn-sm">Edit Post</Link>
              <button onClick={() => setDeleteModal({ isOpen: true, type: 'post', commentId: null })} className="btn-danger btn-sm">Delete</button>
            </div>
          )}
        </div>
        
        <div className="post-metrics">
          <span className="metric">⏱️ {Math.max(1, Math.ceil(post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200))} min read</span>
          <span className="metric">👁️ {post.views} views</span>
        </div>
      </div>

      {post.image && (
        <div className="post-detail-image-container">
          <img src={post.image} alt={post.title} className="post-detail-image" />
        </div>
      )}

      <div className="post-detail-content ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="post-interaction-bar">
        <div className="interaction-left">
          <button onClick={handleLike} className={`like-btn ${isLiked ? 'liked' : ''}`}>
            {isLiked ? '❤️' : '🤍'} {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
          </button>
          <span className="comment-count">💬 {post.comments.length} Comments</span>
        </div>
        <div className="interaction-right">
          <button className="share-btn" onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}>🔗 Share</button>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? "Add a comment..." : "Login to comment..."}
            rows="3"
            required
            disabled={!user || commenting}
          ></textarea>
          <div className="comment-form-actions">
            <button type="submit" className="btn-primary" disabled={!user || commenting || !commentText.trim()}>
              {commenting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        <div className="comments-list">
          {post.comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    {comment.author?.avatar ? (
                      <img src={comment.author.avatar} alt="Author" className="comment-avatar" />
                    ) : (
                      <div className="comment-avatar-placeholder">{comment.author?.name?.charAt(0) || '?'}</div>
                    )}
                    <span className="comment-name">{comment.author?.name || 'Unknown'}</span>
                    <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {(user && (user._id === comment.author?._id || isAuthor)) && (
                    <button onClick={() => setDeleteModal({ isOpen: true, type: 'comment', commentId: comment._id })} className="comment-delete-btn">
                      🗑️
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        title={deleteModal.type === 'post' ? 'Delete Post' : 'Delete Comment'}
        message={deleteModal.type === 'post' ? 'Are you sure you want to delete this post completely? This action cannot be undone.' : 'Are you sure you want to delete this comment?'}
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, type: '', commentId: null })}
      />
    </div>
  );
};

export default PostDetail;
