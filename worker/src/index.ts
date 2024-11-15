import { NatsQueue } from './queue/NatsQueue';
import { WorkerController } from './controller/WorkerController';
import { QueueParameters } from './common/types';
import { Consumer } from './queue/Consumer';

// const natsQueue = new NatsQueue();
// const workerController = new WorkerController();

// const queueName = 'queue';

// // Subscribe to the queue and process messages using WorkerController
// natsQueue.subscribe(queueName, (message: QueueParameters) => {
//     workerController.process(message);
// });

Consumer.init((msg) => {
    console.log(msg)
});
