// Libraries
import express from 'express';

// Controller
import serviceController from '../controllers/service';
import { validateAuthToken } from '../controllers/utils';

const router = express.Router();

router.post('/createService',
  validateAuthToken,
  serviceController.validateRole,
  serviceController.validateParams,
  serviceController.saveService,
);

router.get('/getServices',
  validateAuthToken,
  serviceController.validateRole,
  serviceController.getAllServices,
);

export default router;