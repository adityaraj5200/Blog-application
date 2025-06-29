import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import MyBlogs from './pages/MyBlogs';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

// Public Route component (for login/register when already authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    
    return children;
};

function AppRoutes() {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />
                <Route path="/" element={<Home />} />
                <Route path="/my-blogs" element={
                    <ProtectedRoute>
                        <MyBlogs />
                    </ProtectedRoute>
                } />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/create" element={
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                    <ProtectedRoute>
                        <EditPost />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;