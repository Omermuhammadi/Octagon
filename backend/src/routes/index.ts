import { Router } from 'express';
import authRoutes from './auth';
import fighterRoutes from './fighters';
import eventRoutes from './events';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Octagon Oracle API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/fighters', fighterRoutes);
router.use('/events', eventRoutes);

export default router;
