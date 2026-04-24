import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getPost, updatePost } from '../services/api';
import Loader from '../components/Loader';
import './PostForm.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', image: '', category: 'General' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPost(id);
        setFormData({
          title: data.title,
          content: data.content,
          image: data.image || '',
          category: data.category || 'General',
        });
      } catch (err) {
        setError('Failed to fetch post details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updatePost(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="post-form-container">
      <div className="form-card">
        <h2>Edit Post</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Programming">Programming</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group quill-editor-container">
            <label>Content</label>
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(content) => setFormData({...formData, content})} 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
