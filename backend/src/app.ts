import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Class Scheduling API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      classes: '/api/classes',
      calendar: '/api/classes/calendar',
    },
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    title: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use(errorHandler);

export default app;