import { useState } from 'react';
import UserCard from './UserCard';

const Leaderboard = ({ users, onRefresh, onRefreshAll, onDelete }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState('');
    const [refreshProgress, setRefreshProgress] = useState({ current: 0, total: 0 });
    
    // Ensure users is always an array
    const usersList = Array.isArray(users) ? users : [];

    const handleRefreshAll = async () => {
        if (usersList.length === 0) {
            setRefreshStatus('No users to refresh');
            setTimeout(() => setRefreshStatus(''), 3000);
            return;
        }

        setRefreshing(true);
        setRefreshProgress({ current: 0, total: usersList.length });
        setRefreshStatus(`Starting refresh...`);

        let successCount = 0;
        let failureCount = 0;
        const results = [];

        try {
            // Refresh users one by one to show progress
            for (let i = 0; i < usersList.length; i++) {
                const user = usersList[i];
                setRefreshProgress({ current: i + 1, total: usersList.length });
                setRefreshStatus(`Refreshing ${user.realName || user.leetcodeUsername} (${i + 1}/${usersList.length})...`);

                try {
                    await onRefresh(user.leetcodeUsername);
                    successCount++;
                    results.push({ username: user.leetcodeUsername, status: 'success' });
                } catch (error) {
                    failureCount++;
                    results.push({ username: user.leetcodeUsername, status: 'failed', error: error.message });
                }

                // Add a small delay to show progress and be respectful to the API
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setRefreshStatus(
                `✅ Completed! ${successCount}/${usersList.length} users refreshed successfully`
            );
        } catch (error) {
            setRefreshStatus(`❌ Failed to refresh users: ${error.message}`);
        } finally {
            setRefreshing(false);
            setRefreshProgress({ current: 0, total: 0 });
            // Clear status after 7 seconds
            setTimeout(() => {
                setRefreshStatus('');
            }, 7000);
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
                        {refreshing && refreshProgress.total > 0 && (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${(refreshProgress.current / refreshProgress.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {refreshProgress.current}/{refreshProgress.total}
                                </span>
                            </div>
                        )}
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
