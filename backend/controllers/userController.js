// backend/controllers/userController.js
import User from '../models/User.js';
import { parseLeetCodeUsername } from '../utils/username.js';
import { fetchLeetCodeStats } from '../services/leetcodeService.js';

/**
 * Add a new LeetCode user to the tracker
 * Accepts both usernames and profile URLs
 */
export const addUser = async (req, res) => {
    try {
        const rawInput = req.body.leetcodeUsername;
        
        // Validate input
        if (!rawInput || typeof rawInput !== 'string') {
            return res.status(400).json({ 
                message: 'LeetCode username or profile URL is required' 
            });
        }

        // Parse and validate username from input
        const username = parseLeetCodeUsername(rawInput);
        if (!username) {
            return res.status(400).json({ 
                message: 'Invalid LeetCode username or profile URL. Please provide a valid LeetCode username or profile link.' 
            });
        }

        console.log(`Adding user: ${username} (from input: ${rawInput})`);

        // Check if user already exists (case insensitive)
        const existingUser = await User.findOne({ 
            leetcodeUsername: { $regex: new RegExp(`^${username}$`, 'i') }
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: `User '${username}' already exists in the tracker` 
            });
        }

        // Fetch LeetCode stats from API
        let stats;
        try {
            stats = await fetchLeetCodeStats(username);
        } catch (apiError) {
            console.error(`API Error for user ${username}:`, apiError.message);
            
            // Return specific error messages based on the API error
            if (apiError.message.includes('not found')) {
                return res.status(404).json({ 
                    message: `LeetCode user '${username}' not found. Please verify the username is correct.` 
                });
            }
            
            return res.status(503).json({ 
                message: `Unable to fetch data for '${username}'. ${apiError.message}` 
            });
        }

        // Validate fetched stats
        if (!stats || typeof stats.totalSolved !== 'number') {
            return res.status(503).json({ 
                message: `Invalid data received for user '${username}'. Please try again.` 
            });
        }

        // Create new user with fetched stats
        const user = await User.create({
            leetcodeUsername: username.toLowerCase(), // Store in lowercase for consistency
            totalSolved: stats.totalSolved,
            easySolved: stats.easySolved,
            mediumSolved: stats.mediumSolved,
            hardSolved: stats.hardSolved,
            ranking: stats.ranking,
            acceptanceRate: stats.acceptanceRate,
            lastUpdated: new Date()
        });

        console.log(`Successfully added user: ${username}`);
        res.status(201).json({
            message: `User '${username}' added successfully`,
            user
        });

    } catch (error) {
        console.error('Error in addUser:', error);
        res.status(500).json({ 
            message: 'Internal server error while adding user. Please try again.' 
        });
    }
};

/**
 * Get all users sorted by total problems solved
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ totalSolved: -1, lastUpdated: -1 }) // Sort by total solved (desc), then by last updated
            .exec();

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ 
            message: 'Error fetching users from database' 
        });
    }
};

/**
 * Refresh/update stats for an existing user
 */
export const refreshUser = async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ message: 'Username parameter is required' });
        }

        // Parse username in case a URL was provided
        const parsedUsername = parseLeetCodeUsername(username);
        if (!parsedUsername) {
            return res.status(400).json({ 
                message: 'Invalid username format' 
            });
        }

        console.log(`Refreshing user: ${parsedUsername}`);

        // Find user in database (case insensitive)
        const user = await User.findOne({ 
            leetcodeUsername: { $regex: new RegExp(`^${parsedUsername}$`, 'i') }
        });
        
        if (!user) {
            return res.status(404).json({ 
                message: `User '${parsedUsername}' not found in tracker` 
            });
        }

        // Fetch updated stats from LeetCode API
        let stats;
        try {
            stats = await fetchLeetCodeStats(parsedUsername);
        } catch (apiError) {
            console.error(`API Error refreshing user ${parsedUsername}:`, apiError.message);
            
            if (apiError.message.includes('not found')) {
                return res.status(404).json({ 
                    message: `LeetCode user '${parsedUsername}' no longer exists or username has changed` 
                });
            }
            
            return res.status(503).json({ 
                message: `Unable to refresh data for '${parsedUsername}'. ${apiError.message}` 
            });
        }

        // Update user with new stats
        const previousStats = {
            totalSolved: user.totalSolved,
            easySolved: user.easySolved,
            mediumSolved: user.mediumSolved,
            hardSolved: user.hardSolved
        };

        user.totalSolved = stats.totalSolved;
        user.easySolved = stats.easySolved;
        user.mediumSolved = stats.mediumSolved;
        user.hardSolved = stats.hardSolved;
        user.ranking = stats.ranking;
        user.acceptanceRate = stats.acceptanceRate;
        user.lastUpdated = new Date();

        await user.save();

        // Calculate progress since last update
        const progress = {
            totalSolved: stats.totalSolved - previousStats.totalSolved,
            easySolved: stats.easySolved - previousStats.easySolved,
            mediumSolved: stats.mediumSolved - previousStats.mediumSolved,
            hardSolved: stats.hardSolved - previousStats.hardSolved
        };

        console.log(`Successfully refreshed user: ${parsedUsername}`);
        res.status(200).json({
            message: `Stats updated for '${parsedUsername}'`,
            user,
            progress
        });

    } catch (error) {
        console.error('Error in refreshUser:', error);
        res.status(500).json({ 
            message: 'Internal server error while refreshing user data' 
        });
    }
};

/**
 * Delete a user from the tracker
 */
export const deleteUser = async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ message: 'Username parameter is required' });
        }

        // Parse username in case a URL was provided
        const parsedUsername = parseLeetCodeUsername(username);
        if (!parsedUsername) {
            return res.status(400).json({ 
                message: 'Invalid username format' 
            });
        }

        console.log(`Deleting user: ${parsedUsername}`);

        // Find and delete user (case insensitive)
        const user = await User.findOneAndDelete({ 
            leetcodeUsername: { $regex: new RegExp(`^${parsedUsername}$`, 'i') }
        });
        
        if (!user) {
            return res.status(404).json({ 
                message: `User '${parsedUsername}' not found in tracker` 
            });
        }

        console.log(`Successfully deleted user: ${parsedUsername}`);
        res.status(200).json({ 
            message: `User '${parsedUsername}' deleted successfully` 
        });

    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ 
            message: 'Internal server error while deleting user' 
        });
    }
};
