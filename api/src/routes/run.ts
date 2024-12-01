import { Router } from 'express';
import { NatsQueue } from '../queue/NatsQueue';
import { RunQueueParameters } from '../common/types';

const QUEUE_NAME = process.env.QUEUE_NAME || 'subject';
const router = Router();

const queue = new NatsQueue();

router.put('/', async (req, res) => {
  if (!queue.isConnected()) {
    res.status(503).json({ message: 'Service unavailable' });
    return;
  }

  req.setTimeout(60000)

  const { image } = req.body;
  
  const message: RunQueueParameters = {
    requestId: `${image}_${Date.now()}`,
    dockerImage: image,
    parameter: 'hostname'
  }

  queue.publish(QUEUE_NAME, message).then((result) => {
    console.log(`Published message: ${result}`);
    console.log(`Waiting for response...`);
    queue.subscribe(message.requestId, (response) => {
      console.log(`Received message: ${response}`);
      res.json({ response });
    });
  }).catch((err) => {
    console.error(`Error publishing message: ${err}`);
    res.status(500).json({ message: 'Internal server error' });
  });
});

export default router;
