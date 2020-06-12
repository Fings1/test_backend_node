// Libraries
import express from 'express';

// Controller
import { register, login } from '../controllers/user';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;