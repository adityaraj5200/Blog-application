import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
    Alert,
    LinearProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { register } = useAuth();

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Calculate password strength when password changes
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (passwordStrength < 75) {
            setError('Password is too weak. Please use a stronger password.');
            setIsLoading(false);
            return;
        }

        try {
            // Remove confirmPassword before sending to backend
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            // Handle specific error messages
            if (errorMessage.includes('Username is already taken')) {
                setError('This username is already taken. Please choose another one.');
            } else if (errorMessage.includes('Email is already registered')) {
                setError('This email is already registered. Please use a different email.');
            } else if (errorMessage.includes('Invalid email format')) {
                setError('Please enter a valid email address.');
            } else if (errorMessage.includes('Password must be at least 8 characters')) {
                setError('Password must be at least 8 characters long.');
            } else {
                setError(errorMessage || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength >= 75) return 'success';
        if (passwordStrength >= 50) return 'warning';
        return 'error';
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 1
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Register
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {formData.password && (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={passwordStrength}
                                color={getPasswordStrengthColor()}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                Password strength: {passwordStrength}%
                            </Typography>
                        </Box>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                        helperText={
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                                ? 'Passwords do not match'
                                : ''
                        }
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, height: 48 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Register'
                        )}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="register-link">
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register; 