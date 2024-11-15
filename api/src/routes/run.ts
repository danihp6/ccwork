import { Router } from 'express';
import { Publisher } from '../queue/Publisher';

const router = Router();

router.get('/', async (req, res) => {
  const publisher = await Publisher.init();
  publisher.publish('test', {test: 'test'});
  res.send('run');
});

export default router;
