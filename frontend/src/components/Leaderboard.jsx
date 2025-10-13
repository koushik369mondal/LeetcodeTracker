import UserCard from './UserCard';

const Leaderboard = ({ users, onRefresh, onDelete }) => {
    return (
        <div className="leaderboard">
            <h1>🏆 LeetCode Progress Tracker</h1>
            {users.length === 0 ? (
                <p className="no-users">No users added yet. Add your first user!</p>
            ) : (
                <div className="users-list">
                    {users.map((user, index) => (
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
