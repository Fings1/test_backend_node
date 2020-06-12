// Libraries
import express from 'express';

// Routes
import userRoutes from './user';
import ticketRoutes from './ticket';
import serviceRoutes from './service';
import workerServiceRoutes from './workerServices';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);
router.use('/service', serviceRoutes);
router.use('/workerService', workerServiceRoutes);

export default router;