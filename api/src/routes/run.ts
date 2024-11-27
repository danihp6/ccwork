import { Router } from 'express';
import { Publisher } from '../queue/Publisher';

const router = Router();

router.put('/', async (req, res) => {
  const { image } = req.body;
  const publisher = await Publisher.init();
  const result = await publisher.publish(image, 'hostname');
  res.send(result);
});

export default router;
