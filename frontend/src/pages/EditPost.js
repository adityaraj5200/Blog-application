import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const EditPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadPost();
    }, [isAuthenticated, navigate, id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/posts/${id}`);
            const post = response.data;
            setTitle(post.title);
            setContent(post.content);
        } catch (error) {
            setError('Error loading post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError('You must be logged in to edit a post');
            return;
        }
        try {
            setIsLoading(true);
            await api.put(`/posts/${id}`, { title, content });
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating post');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Post
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
                        {isLoading ? 'Saving...' : 'Update Post'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditPost; 