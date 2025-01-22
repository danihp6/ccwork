import { NatsQueue } from './queue/NatsQueue';
import { WorkerController } from './controller/WorkerController';
import { RunQueueParameters } from './common/types';

const SUBJECT = process.env.SUBJECT || 'executions';

const natsQueue = new NatsQueue();
const workerController = new WorkerController();

async function initialize() {
    // Check if the queue is connected
    while (!natsQueue.isConnected()) {
        console.log('Waiting for queue to connect...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Subscribe to the queue and process messages using WorkerController
    natsQueue.subscribe(SUBJECT, workerController)
}

initialize();