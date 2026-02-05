import { Router } from 'express';
import classRoutes from './class.route';

const router = Router();

router.use('/classes', classRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;