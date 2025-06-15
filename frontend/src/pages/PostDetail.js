import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Chip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Post not found');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Failed to delete post');
        }
    };

    const isAuthor = post && user && post.authorUsername === user.username;

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    if (error || !post) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography color="error">{error || 'Post not found'}</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {post.title}
                    </Typography>
                    {isAuthor && (
                        <Box>
                            <IconButton
                                onClick={() => navigate(`/edit/${post.id}`)}
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setDeleteDialogOpen(true)}
                                color="error"
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={`By ${post.authorUsername}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
                    {post.content}
                </Typography>

                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Delete Post</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default PostDetail; 