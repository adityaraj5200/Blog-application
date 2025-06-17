import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogPostList from '../components/BlogPostList';
import api from '../services/axiosConfig';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { isAuthenticated, user } = useAuth();

    const loadPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []); // Load posts on component mount

    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`);
            // Remove the deleted post from the state
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <Container maxWidth="md">
            {isAuthenticated ? (
                <>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                        Welcome, {user?.username}!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Button
                            component={Link}
                            to="/create"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Create New Post
                        </Button>
                    </Box>
                    <BlogPostList
                        posts={posts}
                        onDelete={handleDelete}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 8, mb: 6 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome to Blog App
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                        Join our community to start sharing your thoughts
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/register"
                            variant="outlined"
                            color="primary"
                            size="large"
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Home; 