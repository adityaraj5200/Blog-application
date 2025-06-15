import React, { useState, useEffect } from 'react';
import { fetchPosts, deletePost } from './services/api';
import BlogPostForm from './components/BlogPostForm';
import BlogPostList from './components/BlogPostList';
import DeleteConfirmation from './components/DeleteConfirmation';
import { Container, Typography } from '@mui/material';

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const loadPosts = async () => {
    try {
      setIsLoading(false);
      const { data } = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting post with id:', id);
      if (!id) {
        console.error('No ID provided for deletion');
        return;
      }
      console.log('Attempting to delete post with id:', id);
      console.log('id', id);
      await deletePost(id); // Using the service we created
      loadPosts(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        Aditya's Blog
      </Typography>
      <BlogPostForm onPostCreated={loadPosts} />
      <BlogPostList
        posts={posts}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      
    </Container>
  );
}

export default App;