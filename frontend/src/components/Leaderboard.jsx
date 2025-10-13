import UserCard from './UserCard';

const Leaderboard = ({ users, onRefresh, onDelete }) => {
    // Ensure users is always an array
    const usersList = Array.isArray(users) ? users : [];

    return (
        <div className="leaderboard">
            <h1>🏆 LeetCode Progress Tracker</h1>
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
