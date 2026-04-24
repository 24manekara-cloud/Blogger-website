import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5005/api',
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bloggerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);

export const getAllPosts = (page = 1, search = '') => API.get(`/posts?page=${page}&search=${search}`);
export const getMyPosts = () => API.get('/posts/my-posts');
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const addComment = (id, content) => API.post(`/posts/${id}/comments`, { content });
export const deleteComment = (postId, commentId) => API.delete(`/posts/${postId}/comments/${commentId}`);

export default API;
