import { useState } from 'react';

const AddUser = ({ onUserAdded }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onUserAdded(username); // send raw string; backend will parse URL to username and fetch realName from API
            setUsername('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-user-container">
            <h2>Add LeetCode User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter LeetCode profile link or username (e.g., https://leetcode.com/u/username/ or username)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add User'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AddUser;
