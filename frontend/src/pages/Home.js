import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '../services/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getAllPosts(page, search);
      setPosts(data.posts);
      setTotalPages(data.pages);
    } catch {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLike = (postId, newLikes) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  const handleDeleteRequest = (postId) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const executeDelete = async () => {
    if (deleteModal.postId) {
      try {
        await deletePost(deleteModal.postId);
        setPosts((prev) => prev.filter((p) => p._id !== deleteModal.postId));
        setDeleteModal({ isOpen: false, postId: null });
      } catch (err) {
        alert('Failed to delete post. You can only delete your own posts.');
      }
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Welcome to Blogger</div>
          <h1 className="hero-title">
            Stories That <span className="gradient-text">Inspire</span>
          </h1>
          <p className="hero-subtitle">
            Discover insightful articles, share your thoughts, and connect with writers from around the world.
          </p>
          <div className="hero-actions">
            <Link to={user ? "/create" : "/register"} className="btn-primary">Start Writing</Link>
            <a href="#posts" className="btn-secondary">Explore Posts</a>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
      </section>

      <section className="posts-section" id="posts">
        <div className="section-header">
          <h2 className="section-title">Latest Posts</h2>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary search-btn">Search</button>
          </form>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handleDeleteRequest} onLike={handleLike} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

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

export default Home;
