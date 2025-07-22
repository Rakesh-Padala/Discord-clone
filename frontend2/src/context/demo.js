import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios'; // Or your preferred HTTP client

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // To manage initial loading state

    // Function to set the token and update authentication status
    const saveToken = useCallback((newToken) => {
        setToken(newToken);
        setIsAuthenticated(!!newToken); // isAuthenticated is true if newToken exists
        // You might also want to decode the token here to extract user info
        // const userData = decodeToken(newToken);
        // setUser(userData);
    }, []);

    // Function to clear the token and log out
    const logout = useCallback(async () => {
        setToken(null);
        setIsAuthenticated(false);
        // Clear the refresh token cookie on the backend
        try {
            await axios.post('/api/logout'); // Your backend endpoint to clear HTTP-only cookie
        } catch (error) {
            console.error('Error logging out on backend:', error);
        }
    }, []);

    // --- Initial check for refresh token and auto-login ---
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Attempt to refresh token from backend (which uses HTTP-only cookie)
                const response = await axios.post('/api/refresh-token');
                if (response.data.accessToken) {
                    saveToken(response.data.accessToken);
                }
            } catch (error) {
                // No valid refresh token or error, user is not authenticated
                console.log('No valid refresh token found or error during refresh:', error.message);
                saveToken(null); // Ensure token is null
            } finally {
                setLoading(false); // Authentication check is complete
            }
        };

        checkAuth();
    }, [saveToken]); // Dependency array: saveToken won't change often

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        token,
        isAuthenticated,
        loading,
        saveToken,
        logout,
    }), [token, isAuthenticated, loading, saveToken, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};