// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

export const fetchPosts = () => API.get('/api/posts');
export const createPost = (newPost) => API.post('/api/posts', newPost);
export const deletePost = async (id) => {
  try {
    await API.delete(`/api/posts/${id}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};