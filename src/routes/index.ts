// Libraries
import express from 'express';

// Routes
import userRoutes from './user';
import ticketRoutes from './ticket';
import serviceRoutes from './service';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);
router.use('/service', serviceRoutes);

export default router;