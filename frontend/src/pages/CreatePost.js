import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { createPost } from '../services/api';
import './PostForm.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', content: '', image: '', category: 'General' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createPost(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <div className="form-card">
        <h2>Create New Post</h2>
        <p className="form-subtitle">Share your ideas with the Blogger community.</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter a catchy title..." />
          </div>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Programming">Programming</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="form-group flex-2">
              <label>Image URL (Optional)</label>
              <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="form-group quill-editor-container">
            <label>Content</label>
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(content) => setFormData({...formData, content})} 
              placeholder="Write your beautiful post here..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
