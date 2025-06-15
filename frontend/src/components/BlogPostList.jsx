import React from 'react';
import { Box, Typography, Paper, Stack, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Added import
import { format } from 'date-fns';

const BlogPostList = ({ posts = [], isLoading = false, onDelete }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Typography variant="body1" align="center" mt={4}>
        No blog posts found. Be the first to create one!
      </Typography>
    );
  }

  return (
    <Stack spacing={3} mt={4}>
      {posts.map((post) => (
        <Paper key={post.id} elevation={3} sx={{ p: 3, position: 'relative' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {post.title}
          <IconButton
            aria-label="delete"
            onClick={() => onDelete(post.id)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <DeleteIcon color="error" />
          </IconButton>
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Posted on: {format(new Date(post.createdAt), 'MMMM d, yyyy h:mm a')}
          </Typography>
        </Paper>
        
      ))}
    </Stack>
  );
};

export default BlogPostList;