import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const userRouter = express.Router();

// Register new user
userRouter.post('/register', registerUser);

// Login user
userRouter.post('/login', loginUser);

export default userRouter;