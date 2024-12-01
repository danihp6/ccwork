import { NatsQueue } from './queue/NatsQueue';
import { WorkerController } from './controller/WorkerController';
import { RunQueueParameters } from './common/types';

const SUBJECT = process.env.SUBJECT || 'subject';

const natsQueue = new NatsQueue();
const workerController = new WorkerController();

async function initialize() {
    // Check if the queue is connected
    while (!natsQueue.isConnected()) {
        console.log('Waiting for queue to connect...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Subscribe to the queue and process messages using WorkerController
    natsQueue.subscribe(SUBJECT, (message: RunQueueParameters) => {
        workerController.process(message).then((output) => {
            natsQueue.publish(message.requestId, {
                result: output,
                status: 200,
            });
        }).catch((err) => {
            console.error('Error processing message:', err);
        });
    });
}

initialize();