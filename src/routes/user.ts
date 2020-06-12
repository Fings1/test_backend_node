// Libraries
import express from 'express';

// Controller
import { register } from '../controllers/user';

const router = express.Router();

router.post('/register', register);

export default router;