// Libraries
import express from 'express';

// Controller
import serviceController from '../controllers/service';
import { validateAuthToken } from '../controllers/utils';

const router = express.Router();

router.post('/createService',
  validateAuthToken,
  serviceController.service.validateRole,
  serviceController.service.validateCreateService,
  serviceController.service.saveService,
);

export default router;