import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', bio: '', avatar: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { data } = await updateProfile(formData);
      setUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {formData.avatar ? (
            <img src={formData.avatar} alt="Avatar Preview" className="profile-avatar-preview" />
          ) : (
            <div className="profile-avatar-placeholder">
              {formData.name.charAt(0) || '?'}
            </div>
          )}
          <div className="profile-header-text">
            <h2>Your Profile</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Avatar URL</label>
            <input 
              type="url" 
              value={formData.avatar} 
              onChange={e => setFormData({...formData, avatar: e.target.value})} 
              placeholder="https://..." 
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
              rows="4" 
              placeholder="Tell us a little about yourself..."
              maxLength="300"
            ></textarea>
            <span className="char-count">{300 - formData.bio.length} characters remaining</span>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
