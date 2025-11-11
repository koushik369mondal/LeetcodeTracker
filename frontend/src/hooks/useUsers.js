import { useState, useEffect } from 'react';
import * as api from '../services/api';

/**
 * Custom hook to manage user data and operations
 * Handles fetching, adding, refreshing, and deleting users
 */
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users from the API
    const fetchUsers = async () => {
        try {
            const data = await api.getAllUsers();
            // Ensure we always set an array
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Set empty array on error to prevent crashes
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Add a new user
    const handleAddUser = async (username) => {
        try {
            await api.addUser(username);
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
            // Re-throw to let AddUser component handle the error display
            throw error;
        }
    };

    // Refresh a single user's stats
    const handleRefresh = async (username) => {
        try {
            await api.refreshUser(username);
            fetchUsers();
        } catch (error) {
            console.error('Error refreshing user:', error);
            // You might want to show a notification here
        }
    };

    // Refresh all users' stats
    const handleRefreshAll = async () => {
        try {
            const result = await api.refreshAllUsers();
            console.log('Refresh all completed:', result);
            fetchUsers(); // Refresh the user list after bulk update
            return result;
        } catch (error) {
            console.error('Error refreshing all users:', error);
            throw error;
        }
    };

    // Delete a user
    const handleDelete = async (username) => {
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            try {
                await api.deleteUser(username);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                // You might want to show a notification here
            }
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        handleAddUser,
        handleRefresh,
        handleRefreshAll,
        handleDelete,
        fetchUsers
    };
};
