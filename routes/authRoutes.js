import express from 'express';
import  { registerUser, loginUser, authen } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register/:userType', registerUser);
router.post('/login', loginUser);
router.get('/user',auth, authen);
export default router;
