import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPosts, deletePost, likePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  const fetchMyPosts = async () => {
    try {
      const { data } = await getMyPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDeleteRequest = (postId) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const executeDelete = async () => {
    if (deleteModal.postId) {
      try {
        await deletePost(deleteModal.postId);
        setPosts(posts.filter(p => p._id !== deleteModal.postId));
        setDeleteModal({ isOpen: false, postId: null });
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await likePost(postId);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: data } : p));
    } catch (err) {
      alert('Failed to like post');
    }
  };

  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h2>Welcome back, <span className="gradient-text">{user.name}</span>!</h2>
          <p>Here is an overview of your Blogger statistics.</p>
        </div>
        <Link to="/create" className="btn-primary">✍️ Create New Post</Link>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Posts</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-info">
            <h3>Total Likes</h3>
            <p className="stat-number">{totalLikes}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>Total Comments</h3>
            <p className="stat-number">{totalComments}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <h3 className="section-title">Your Posts</h3>
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>You haven't written any articles. Time to share your thoughts!</p>
            <Link to="/create" className="btn-primary">Write your first post</Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handleDeleteRequest} 
                onLike={() => handleLike(post._id)} 
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, postId: null })}
      />
    </div>
  );
};

export default Dashboard;
