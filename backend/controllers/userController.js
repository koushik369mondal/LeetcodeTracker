import User from '../models/User.js';
import leetcodeService from '../services/leetcodeService.js';

export const addUser = async (req, res) => {
    try {
        const { leetcodeUsername } = req.body;

        if (!leetcodeUsername) {
            return res.status(400).json({ message: 'LeetCode username is required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ leetcodeUsername });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Fetch LeetCode stats
        const stats = await leetcodeService.getUserStats(leetcodeUsername);

        // Create new user
        const user = await User.create({
            leetcodeUsername,
            ...stats
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ totalSolved: -1 }) // Sort by total problems solved (descending)
            .exec();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshUser = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ leetcodeUsername: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch updated stats
        const stats = await leetcodeService.getUserStats(username);

        // Update user
        user.totalSolved = stats.totalSolved;
        user.easySolved = stats.easySolved;
        user.mediumSolved = stats.mediumSolved;
        user.hardSolved = stats.hardSolved;
        user.ranking = stats.ranking;
        user.acceptanceRate = stats.acceptanceRate;
        user.lastUpdated = Date.now();

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOneAndDelete({ leetcodeUsername: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
