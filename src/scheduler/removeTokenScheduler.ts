import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { logger } from '../app/logging';

const prisma = new PrismaClient();

// Function to remove tokens
async function removeTokens() {
    try {
        const result = await prisma.user.updateMany({
            data: { token: null },
            where: { token: { not: null } }
        });

        logger.info(`Removed tokens from ${result.count} users`);
    } catch (error) {
        logger.error('Error removing tokens:', error);
    }
}

// Schedule task to run every 1 minutes
// cron.schedule('*/1 * * * *', () => {
// Schedule task to run every 12 hours
cron.schedule('0 */12 * * *', () => {
    logger.info('================ RUNNING TOKEN REMOVAL JOB ================');
    removeTokens();
});
