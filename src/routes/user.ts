// Libraries
import express from 'express';

// Controller
import userController from '../controllers/user';

const router = express.Router();

router.post('/register',
  userController.register.validateRegisterParams,
  userController.register.validateUserType,
  userController.register.encryptPassword,
  userController.register.saveUser
);

router.post('/login',
  userController.login.validateLoginParams,
  userController.login.validatePassword,
  userController.login.createToken
);

export default router;