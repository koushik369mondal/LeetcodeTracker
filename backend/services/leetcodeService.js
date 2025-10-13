// backend/services/leetcodeService.js
import axios from 'axios';

/**
 * Primary LeetCode API service with fallback providers
 * Uses leetcode-api-pied.vercel.app as primary endpoint
 */

const providers = [
  // Primary API: leetcode-api-pied.vercel.app
  {
    name: 'leetcode-api-pied',
    url: (username) => `https://leetcode-api-pied.vercel.app/user/${username}`,
    method: 'GET',
    map: (data) => {
      // Handle the actual API response structure
      const submitStats = data.submitStats || {};
      const acSubmissionNum = submitStats.acSubmissionNum || [];
      
      // Extract counts by difficulty
      const getCount = (difficulty) => {
        const stat = acSubmissionNum.find(item => item.difficulty === difficulty);
        return stat ? parseInt(stat.count) || 0 : 0;
      };

      const totalSolved = getCount('All');
      const easySolved = getCount('Easy');
      const mediumSolved = getCount('Medium');
      const hardSolved = getCount('Hard');
      
      // Calculate acceptance rate
      const totalSubmissionNum = data.submitStats?.totalSubmissionNum || [];
      const totalSubmissions = totalSubmissionNum.find(item => item.difficulty === 'All')?.count || 0;
      const acceptanceRate = totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100).toFixed(2) : 0;

      return {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        ranking: data.profile?.ranking || 0,
        acceptanceRate: parseFloat(acceptanceRate)
      };
    }
  },
  
  // Fallback API: leetcode-restful-api.vercel.app
  {
    name: 'leetcode-restful-api',
    url: () => `https://leetcode-restful-api.vercel.app/profile`,
    method: 'POST',
    body: (username) => ({ username }),
    map: (data) => {
      const list = data.submitStatsGlobal?.acSubmissionNum || [];
      const getCount = (difficulty) => {
        const stat = list.find(x => x.difficulty === difficulty);
        return stat ? parseInt(stat.count) || 0 : 0;
      };

      const totalSolved = getCount('All');
      const totalSubmissions = data.submitStatsGlobal?.totalSubmissionNum?.find(x => x.difficulty === 'All')?.count || 0;
      const acceptanceRate = totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100).toFixed(2) : 0;

      return {
        totalSolved,
        easySolved: getCount('Easy'),
        mediumSolved: getCount('Medium'),
        hardSolved: getCount('Hard'),
        ranking: data.profile?.ranking || 0,
        acceptanceRate: parseFloat(acceptanceRate)
      };
    }
  },

  // Additional fallback API
  {
    name: 'tashif-api',
    url: (username) => `https://tashif.codes/projects/leetcode-stats-api/${username}`,
    method: 'GET',
    map: (data) => ({
      totalSolved: parseInt(data.totalSolved) || 0,
      easySolved: parseInt(data.easySolved) || 0,
      mediumSolved: parseInt(data.mediumSolved) || 0,
      hardSolved: parseInt(data.hardSolved) || 0,
      ranking: parseInt(data.ranking) || 0,
      acceptanceRate: parseFloat(data.acceptanceRate) || 0
    })
  }
];

/**
 * Fetches LeetCode statistics for a given username
 * Tries multiple API providers with fallback mechanism
 */
export async function fetchLeetCodeStats(username) {
  if (!username || typeof username !== 'string') {
    throw new Error('Valid username is required');
  }

  let lastError;
  let attemptedProviders = [];

  for (const provider of providers) {
    try {
      console.log(`Attempting to fetch data from ${provider.name} for user: ${username}`);
      
      let response;
      if (provider.method === 'POST') {
        response = await axios.post(provider.url(username), provider.body(username), {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        response = await axios.get(provider.url(username), {
          timeout: 10000
        });
      }

      const mappedData = provider.map(response.data);
      
      // Validate that we got meaningful data
      if (mappedData && Number.isFinite(mappedData.totalSolved) && mappedData.totalSolved >= 0) {
        console.log(`Successfully fetched data from ${provider.name}`);
        return mappedData;
      }
      
      throw new Error(`Invalid data structure from ${provider.name}`);
      
    } catch (error) {
      attemptedProviders.push(provider.name);
      lastError = error;
      
      // Check for specific error types
      if (error.response?.status === 404) {
        console.log(`User '${username}' not found on ${provider.name}`);
      } else if (error.code === 'ECONNABORTED') {
        console.log(`Timeout error with ${provider.name}`);
      } else {
        console.log(`Error with ${provider.name}: ${error.message}`);
      }
      
      // Continue to next provider
      continue;
    }
  }

  // If we get here, all providers failed
  const errorMessage = lastError?.response?.status === 404 
    ? `LeetCode user '${username}' not found. Please check the username and try again.`
    : `Unable to fetch LeetCode data for '${username}'. All API providers (${attemptedProviders.join(', ')}) are currently unavailable. Please try again later.`;
    
  throw new Error(errorMessage);
}

// Legacy class for backward compatibility
class LeetCodeService {
    async getUserStats(username) {
        return fetchLeetCodeStats(username);
    }
}

const leetcodeService = new LeetCodeService();

// Keep default export for backward compatibility
export default leetcodeService;
