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
            const usersList = Array.isArray(data) ? data : [];
            console.log('Fetched users:', usersList.length, 'users');
            console.log('Users with GitHub:', usersList.filter(u => u.githubUrl).length);
            setUsers(usersList);
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
            await fetchUsers(); // Wait for fresh data to be fetched
        } catch (error) {
            console.error('Error adding user:', error);
            // Re-throw to let AddUser component handle the error display
            throw error;
        }
    };

    // Refresh a single user's stats
    const handleRefresh = async (username) => {
        try {
            const response = await api.refreshUser(username);
            console.log('Refresh response for', username, ':', response);
            await fetchUsers(); // Wait for fresh data to be fetched
        } catch (error) {
            console.error('Error refreshing user:', error);
            // You might want to show a notification here
        }
    };

    // Refresh all users' stats (handled by Leaderboard component)
    // This is just a wrapper for individual refreshes
    const handleRefreshAll = async (username) => {
        try {
            await api.refreshUser(username);
            await fetchUsers(); // Wait for fresh data to be fetched
        } catch (error) {
            console.error('Error refreshing user:', error);
            throw error;
        }
    };

    // Delete a user
    const handleDelete = async (username) => {
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            try {
                await api.deleteUser(username);
                await fetchUsers(); // Wait for fresh data to be fetched
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
