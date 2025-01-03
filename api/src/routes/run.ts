import { Router } from 'express';
import { NatsQueue } from '../queue/NatsQueue';
import { RunQueueParameters } from '../common/types';
import Function from '../models/function';
import { getUserFromJWT } from '../middlewares/GetUserFromJWT';

const QUEUE_NAME = process.env.QUEUE_NAME || 'subject';
const router = Router();

const queue = new NatsQueue();

router.put('/', getUserFromJWT, async (req, res) => {
  if (!queue.isConnected()) {
    res.status(503).json({ message: 'Service unavailable' });
    return;
  }

  req.setTimeout(60000);

  const { image, parameter } = req.body;

  const result = await Function.find({
    username: req.params.user,
    image,
  });

  if (result.length === 0) {
    res.status(404).json({ message: 'Function not found' });
    return;
  }

  const message: RunQueueParameters = {
    requestId: `${image}_${Date.now()}`,
    dockerImage: image,
    parameter: parameter
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
