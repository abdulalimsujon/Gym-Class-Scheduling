import express from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validationSchemaRequest';
import { createUserZodSchema } from '../user/user.validation';

const router = express.Router();

router.post('/login', authController.login);
router.post(
  '/register',
  validateRequest(createUserZodSchema),
  authController.register,
);

export const authRoutes = router;
