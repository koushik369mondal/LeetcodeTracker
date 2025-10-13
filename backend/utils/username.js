// backend/utils/username.js

/**
 * Extracts LeetCode username from various input formats
 * Supports:
 * - Full profile URL with /u/: https://leetcode.com/u/{username}/
 * - Full profile URL without /u/: https://leetcode.com/{username}/
 * - Plain username only: {username}
 * - Case insensitive matching with whitespace trimming
 * - Usernames with letters, numbers, hyphens, and underscores
 */
export function parseLeetCodeUsername(input) {
    if (!input || typeof input !== 'string') {
        return null;
    }

    // Trim whitespace and convert to lowercase for URL matching
    const trimmed = input.trim();
    if (!trimmed) {
        return null;
    }

    // Regular expression to match various LeetCode URL formats
    // Matches: leetcode.com/u/username, leetcode.com/username, or just username
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([A-Za-z0-9_-]+)\/?(?:\?.*)?(?:#.*)?$/i;
    const match = trimmed.match(urlPattern);

    if (match) {
        // Extract username from URL
        const username = match[1];
        return isValidUsername(username) ? username : null;
    }

    // If not a URL, treat as plain username
    return isValidUsername(trimmed) ? trimmed : null;
}

/**
 * Validates if a string is a valid LeetCode username
 * Valid usernames contain only letters, numbers, hyphens, and underscores
 * Must be between 1 and 30 characters
 */
function isValidUsername(username) {
    if (!username || typeof username !== 'string') {
        return false;
    }

    // Check length (typical LeetCode username constraints)
    if (username.length < 1 || username.length > 30) {
        return false;
    }

    // Check valid characters: letters, numbers, hyphens, underscores
    const validPattern = /^[A-Za-z0-9_-]+$/;
    return validPattern.test(username);
}
