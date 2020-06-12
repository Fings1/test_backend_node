// Libraries
import express from 'express';

// Controller
import userController from '../controllers/user';
import { validateAuthToken } from '../controllers/utils';

const router = express.Router();

router.post('/register',
  userController.validateRegisterParams,
  userController.validateUserType,
  userController.encryptPassword,
  userController.saveUser
);

router.post('/login',
  userController.validateLoginParams,
  userController.validatePassword,
  userController.createToken
);

router.get('/getWorkers',
  validateAuthToken,
  userController.validateRole,
  userController.getAllWorkers,
);

export default router;