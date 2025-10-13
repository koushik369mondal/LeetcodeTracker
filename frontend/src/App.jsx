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
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (username) => {
        await api.addUser(username);
        fetchUsers();
    };

    const handleRefresh = async (username) => {
        await api.refreshUser(username);
        fetchUsers();
    };

    const handleDelete = async (username) => {
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            await api.deleteUser(username);
            fetchUsers();
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
