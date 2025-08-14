import express from 'express';
import { classController } from './class.controller';
import Auth from '../../middleware/Auth';
import { UserRole } from '../user/user.interface';

const router = express.Router();

// Admin-only routes
router.post('/create', Auth(UserRole.ADMIN), classController.createClass);
router.put('/update/:id', Auth(UserRole.ADMIN), classController.updateClass);
router.delete('/delete/:id', Auth(UserRole.ADMIN), classController.deleteClass);

// All roles can view
router.get(
  '/',
  Auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  classController.getAllClasses,
);
router.get('/single/:id', Auth(UserRole.ADMIN), classController.getSingleClass);
router.get(
  '/own-trainer-classes',
  Auth(UserRole.TRAINEE),
  classController.getMyClasses,
);

export const classRoutes = router;
