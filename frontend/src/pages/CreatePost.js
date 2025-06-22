import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the post ID from URL if editing
    const { isAuthenticated } = useAuth();
    const isEditMode = id ? true : false;

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // If editing, load the existing post data
        if (isEditMode) {
            loadPost();
        }
    }, [isAuthenticated, navigate, id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            console.log('Loading post with ID:', id);
            const response = await api.get(`/posts/${id}`);
            const post = response.data;
            console.log('Loaded post data:', post);
            setTitle(post.title);
            setContent(post.content);
        } catch (error) {
            console.error('Error loading post:', error);
            setError('Error loading post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError('You must be logged in to create a post');
            return;
        }

        console.log('Submit called. isEditMode:', isEditMode, 'id:', id);
        console.log('Form data - title:', title, 'content:', content);

        try {
            setIsLoading(true);
            if (isEditMode) {
                // Update existing post
                console.log('Attempting to update post with ID:', id);
                const response = await api.put(`/posts/${id}`, { title, content });
                console.log('Update response:', response.data);
                console.log('Post updated successfully');
            } else {
                // Create new post
                console.log('Attempting to create new post');
                const response = await api.post('/posts', { title, content });
                console.log('Create response:', response.data);
                console.log('Post created successfully');
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving post:', error);
            console.error('Error response:', error.response);
            if (error.response?.status === 403) {
                setError('Your session may have expired. Please try logging in again.');
            } else {
                setError(error.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} post`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null; // Don't render the form if not authenticated
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditMode ? 'Edit Post' : 'Create New Post'}
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                        disabled={isLoading}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        required
                        multiline
                        rows={6}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreatePost; 