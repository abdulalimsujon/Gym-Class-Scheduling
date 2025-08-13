import express from 'express';
import { classController } from './class.controller';
import Auth from '../../middleware/Auth';
import { UserRole } from '../user/user.interface';

const router = express.Router();

// Admin-only routes
router.post('/', Auth(UserRole.ADMIN), classController.createClass);
router.put('/:id', Auth(UserRole.ADMIN), classController.updateClass);
router.delete('/:id', Auth(UserRole.ADMIN), classController.deleteClass);

// All roles can view
router.get(
  '/',
  Auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  classController.getAllClasses,
);
router.get(
  '/:id',
  Auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  classController.getSingleClass,
);

export const classRoutes = router;
