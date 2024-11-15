import { Router } from 'express';
import { Publisher } from '../queue/Publisher';

const router = Router();

router.get('/', async (req, res) => {
  const publisher = await Publisher.init();
  const result = await publisher.publish('test', {test: 'test'});
  res.send(result);
});

export default router;
