import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_KEY = process.env.JWT_KEY || 'jwt-key';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

router.post('/', (req, res) => {
  const token = jwt.sign({
    key: JWT_KEY,
  }, JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

export default router;
