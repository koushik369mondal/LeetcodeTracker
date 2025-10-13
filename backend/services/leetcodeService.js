import axios from 'axios';

class LeetCodeService {
    constructor() {
        // Using the free LeetCode API
        this.apiUrl = 'https://leetcode-api-pied.vercel.app';
    }

    async getUserStats(username) {
        try {
            const response = await axios.get(`${this.apiUrl}/user/${username}`);

            const data = response.data;

            return {
                totalSolved: data.totalSolved || 0,
                easySolved: data.easySolved || 0,
                mediumSolved: data.mediumSolved || 0,
                hardSolved: data.hardSolved || 0,
                ranking: data.ranking || 0,
                acceptanceRate: data.acceptanceRate || 0
            };
        } catch (error) {
            throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
        }
    }
}

export default new LeetCodeService();
