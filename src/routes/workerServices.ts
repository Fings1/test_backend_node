// Libraries
import express from 'express';

// Controller
import workerServiceController from '../controllers/workerServices';
import { validateAuthToken } from '../controllers/utils';

const router = express.Router();

router.post('/createWorkerService',
  validateAuthToken,
  workerServiceController.validateRole,
  workerServiceController.validateParams,
  workerServiceController.validateWorkerAndServiceIds,
  workerServiceController.saveWorkerService,
);

export default router;