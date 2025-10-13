const UserCard = ({ user, rank, onRefresh, onDelete }) => {
    return (
        <div className="user-card">
            <div className="rank-badge">{rank}</div>
            <div className="user-info">
                <h3>{user.realName || user.leetcodeUsername}</h3>
                <p className="username">@{user.leetcodeUsername}</p>
                <div className="stats-container">
                    <div className="stat">
                        <span className="label">Total:</span>
                        <span className="value">{user.totalSolved}</span>
                    </div>
                    <div className="stat easy">
                        <span className="label">Easy:</span>
                        <span className="value">{user.easySolved}</span>
                    </div>
                    <div className="stat medium">
                        <span className="label">Medium:</span>
                        <span className="value">{user.mediumSolved}</span>
                    </div>
                    <div className="stat hard">
                        <span className="label">Hard:</span>
                        <span className="value">{user.hardSolved}</span>
                    </div>
                </div>
                <div className="actions">
                    <button 
                        onClick={() => window.open(`https://leetcode.com/u/${user.leetcodeUsername}/`, '_blank')}
                        className="view-profile"
                        title={`View ${user.realName || user.leetcodeUsername}'s LeetCode profile`}
                    >
                        👁️ View Profile
                    </button>
                    <button onClick={() => onRefresh(user.leetcodeUsername)}>
                        🔄 Refresh
                    </button>
                    <button onClick={() => onDelete(user.leetcodeUsername)} className="delete">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
