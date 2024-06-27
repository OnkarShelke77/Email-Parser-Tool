import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('emailQueue', {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

export const addEmailToQueue = async (email: any) => {
    await emailQueue.add('processEmail', email);
};

export const setupEmailWorker = () => {
    const worker = new Worker('emailQueue', async job => {
        // Process the email
    }, {
        connection: {
            host: 'localhost',
            port: 6379,
        }
    });
};
