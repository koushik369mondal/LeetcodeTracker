import { useState } from 'react';
import UserCard from './UserCard';

const Leaderboard = ({ users, onRefresh, onRefreshAll, onDelete }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState('');
    
    // Ensure users is always an array
    const usersList = Array.isArray(users) ? users : [];

    const handleRefreshAll = async () => {
        if (usersList.length === 0) {
            setRefreshStatus('No users to refresh');
            setTimeout(() => setRefreshStatus(''), 3000);
            return;
        }

        setRefreshing(true);
        setRefreshStatus(`Refreshing ${usersList.length} users...`);

        try {
            const result = await onRefreshAll();
            setRefreshStatus(
                `✅ ${result.summary.success}/${result.summary.total} users refreshed successfully`
            );
        } catch (error) {
            setRefreshStatus(`❌ Failed to refresh users: ${error.message}`);
        } finally {
            setRefreshing(false);
            // Clear status after 5 seconds
            setTimeout(() => setRefreshStatus(''), 5000);
        }
    };

    return (
        <div className="leaderboard">
            <div className="leaderboard-header">
                <h1>🏆 LeetCode Progress Tracker</h1>
                {usersList.length > 0 && (
                    <div className="refresh-all-section">
                        <button 
                            className={`refresh-all-btn ${refreshing ? 'refreshing' : ''}`}
                            onClick={handleRefreshAll}
                            disabled={refreshing}
                        >
                            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh All'}
                        </button>
                        {refreshStatus && (
                            <p className={`refresh-status ${refreshStatus.includes('❌') ? 'error' : 'success'}`}>
                                {refreshStatus}
                            </p>
                        )}
                    </div>
                )}
            </div>
            
            {usersList.length === 0 ? (
                <p className="no-users">No users added yet. Add your first user!</p>
            ) : (
                <div className="users-list">
                    {usersList.map((user, index) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            rank={index + 1}
                            onRefresh={onRefresh}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
