import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post, onDelete, onLike }) => {
  const { user } = useAuth();
  const isAuthor = user && post.author && user._id === post.author._id;
  const isLiked = user && post.likes.includes(user._id);

  return (
    <div className="post-card">
      {post.image && (
        <Link to={`/post/${post.slug || post._id}`} className="post-image-link">
          <img src={post.image} alt={post.title} className="post-image" />
        </Link>
      )}
      <div className="post-content">
        <span className="post-category">{post.category}</span>
        <Link to={`/post/${post.slug || post._id}`} className="post-title-link">
          <h3 className="post-title">{post.title}</h3>
        </Link>
        <p className="post-excerpt">
          {post.content.replace(/<[^>]*>?/gm, '').length > 120 ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : post.content.replace(/<[^>]*>?/gm, '')}
        </p>
        
        <div className="post-footer">
          <div className="post-author">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt="Author" className="author-avatar" />
            ) : (
              <div className="author-avatar-placeholder">
                {post.author?.name?.charAt(0) || '?'}
              </div>
            )}
            <span className="author-name">{post.author?.name || 'Unknown'}</span>
          </div>
          
          <div className="post-stats">
            <span className="stat" title="Reading Time">⏱️ {Math.max(1, Math.ceil(post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200))}m</span>
            <span className="stat" title="Views">👁️ {post.views || 0}</span>
            <span className="stat" title="Likes" style={{ color: isLiked ? '#ef4444' : 'inherit' }}>
              {isLiked ? '❤️' : '🤍'} {post.likes.length}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="btn-secondary btn-sm">Edit</Link>
            <button onClick={() => onDelete(post._id)} className="btn-danger btn-sm">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
