import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import BlogPostList from '../components/BlogPostList';
import api from '../services/axiosConfig';

const MyBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const loadPosts = useCallback(async () => {
        try {
            const response = await api.get('/posts');
            // Filter posts to show only the user's posts
            const userPosts = response.data.filter(post => post.authorUsername === user?.username);
            setPosts(userPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.username]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`);
            // Remove the deleted post from the state
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                My Blog Posts
            </Typography>
            {posts.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        You haven't created any blog posts yet.
                    </Typography>
                </Box>
            ) : (
                <BlogPostList
                    posts={posts}
                    onDelete={handleDelete}
                />
            )}
        </Container>
    );
};

export default MyBlogs; 