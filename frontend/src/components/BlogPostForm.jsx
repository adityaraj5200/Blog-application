// src/components/BlogPostForm.jsx
import React, { useState } from 'react';
import { createPost } from '../services/api';
import { Button, TextField, Box, Typography } from '@mui/material';

const BlogPostForm = ({ onPostCreated }) => {
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(postData);
      onPostCreated();
      setPostData({ title: '', content: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Post
      </Typography>
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Content"
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        value={postData.content}
        onChange={(e) => setPostData({ ...postData, content: e.target.value })}
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default BlogPostForm;