import AddUser from './components/AddUser';
import Leaderboard from './components/Leaderboard';
import Loading from './components/Loading';
import { useUsers } from './hooks/useUsers';
import './App.css';

function App() {
    const {
        users,
        loading,
        handleAddUser,
        handleRefresh,
        handleRefreshAll,
        handleDelete,
        handleClearCache
    } = useUsers();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app">
            <AddUser onUserAdded={handleAddUser} />
            <Leaderboard
                users={users}
                onRefresh={handleRefresh}
                onRefreshAll={handleRefreshAll}
                onDelete={handleDelete}
                onClearCache={handleClearCache}
            />
            <footer className="app-footer">
                <div className="footer-content">
                    <p>🚀 Found a bug or want to add a feature? Contributions welcome!</p>
                    <a
                        href="https://github.com/koushik369mondal/LeetcodeTracker.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        <span>⭐</span> Fork & Contribute on GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
