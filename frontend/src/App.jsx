import { useState, useEffect } from 'react';
import AddUser from './components/AddUser';
import Leaderboard from './components/Leaderboard';
import * as api from './services/api';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handleRefresh = async (username) => {
        try {
            await api.refreshUser(username);
            fetchUsers();
        } catch (error) {
            console.error('Error refreshing user:', error);
            // You might want to show a notification here
        }
    };

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

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="app">
            <AddUser onUserAdded={handleAddUser} />
            <Leaderboard
                users={users}
                onRefresh={handleRefresh}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default App;
