import cron from 'cron';
import https from 'https';

// /**
//  * Cron job to keep the server awake by pinging the API endpoint
//  * Schedule: */14 * * * * - Runs every 14 minutes
    // * 
//  * Cron format:
//  * ┌────────────── minute(0 - 59)
//     * │ ┌──────────── hour(0 - 23)
//         * │ │ ┌────────── day of month(1 - 31)
//             * │ │ │ ┌──────── month(1 - 12)
//                 * │ │ │ │ ┌────── day of week(0 - 7)(Sunday = 0 or 7)
//                     * │ │ │ │ │
//  * * * * * *
//  */

const pingServer = () => {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
        console.error('❌ API_URL environment variable is not set');
        return;
    }

    console.log(`🔄 Pinging server at ${new Date().toLocaleString()}...`);

    https.get(apiUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Server pinged successfully - Status:', res.statusCode);
        } else {
            console.error(`⚠️ Server ping returned non-200 status - Status:`, res.statusCode);
        }
    }).on('error', (error) => {
        console.error('❌ Error pinging server:', error.message);
    });
};

// Create cron job - runs every 14 minutes
const keepAliveJob = new cron.CronJob(
    '*/14 * * * *', // Every 14 minutes
    pingServer, // Function to execute
    null, // onComplete (not used)
    false, // Start immediately (false - we'll start manually)
    'America/New_York' // Timezone (adjust as needed)
);

// Start the cron job
export const startCronJobs = () => {
    keepAliveJob.start();
    console.log('⏰ Cron job started - Server will be pinged every 14 minutes');
};

export default keepAliveJob;
