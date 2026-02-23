// backend/utils/cache.js
import NodeCache from 'node-cache';

/**
 * Cache service for storing LeetCode API responses
 * 
 * Configuration:
 * - stdTTL: 3600 seconds (1 hour) - default time-to-live for cached data
 * - checkperiod: 600 seconds (10 minutes) - how often to check for expired keys
 * - useClones: false - for better performance, don't clone objects
 */
class CacheService {
    constructor() {
        // Main cache for LeetCode API responses
        this.cache = new NodeCache({
            stdTTL: 3600, // 1 hour default TTL
            checkperiod: 600, // Check for expired keys every 10 minutes
            useClones: false
        });

        // Short-term cache for user data (5 minutes TTL)
        this.shortCache = new NodeCache({
            stdTTL: 300, // 5 minutes
            checkperiod: 120, // Check every 2 minutes
            useClones: false
        });

        // Setup event listeners for debugging
        this.cache.on('set', (key, value) => {
            console.log(`Cache SET: ${key}`);
        });

        this.cache.on('del', (key, value) => {
            console.log(`Cache DEL: ${key}`);
        });

        this.cache.on('expired', (key, value) => {
            console.log(`Cache EXPIRED: ${key}`);
        });
    }

    /**
     * Get value from cache by key
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined
     */
    get(key) {
        return this.cache.get(key);
    }

    /**
     * Set value in cache with optional TTL
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in seconds (optional)
     * @returns {boolean} Success status
     */
    set(key, value, ttl) {
        if (ttl) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }

    /**
     * Delete value from cache
     * @param {string} key - Cache key
     * @returns {number} Number of deleted entries
     */
    del(key) {
        return this.cache.del(key);
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return this.cache.has(key);
    }

    /**
     * Get value from short-term cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined
     */
    getShort(key) {
        return this.shortCache.get(key);
    }

    /**
     * Set value in short-term cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in seconds (optional)
     * @returns {boolean} Success status
     */
    setShort(key, value, ttl) {
        if (ttl) {
            return this.shortCache.set(key, value, ttl);
        }
        return this.shortCache.set(key, value);
    }

    /**
     * Clear all cache entries
     */
    flush() {
        this.cache.flushAll();
        this.shortCache.flushAll();
        console.log('All caches flushed');
    }

    /**
     * Get cache statistics
     * @returns {object} Cache stats
     */
    getStats() {
        return {
            main: this.cache.getStats(),
            short: this.shortCache.getStats()
        };
    }

    /**
     * Get all cache keys
     * @returns {string[]} Array of cache keys
     */
    keys() {
        return this.cache.keys();
    }
}

// Export singleton instance
const cacheService = new CacheService();
export default cacheService;
