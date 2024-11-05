import express from 'express';
import {
  desregister,
  register,
  run
} from './routes';

const app = express();
app.use(express.json());

app.use('/desregister', desregister);
app.use('/register', register);
app.use('/run', run);

export default app;
