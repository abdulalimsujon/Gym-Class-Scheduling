import { Router } from 'express';
import { userController } from './user.controller';
import Auth from '../../middleware/Auth';
import { UserRole } from './user.interface';

const router = Router();

// CRUD routes (Admin can manage users)
router.post('/', Auth(UserRole.ADMIN), userController.create);
router.get('/', Auth(UserRole.ADMIN), userController.getAll);
router.get('/:id', Auth(UserRole.ADMIN), userController.getById);
router.put('/:id', Auth(UserRole.ADMIN), userController.update);
router.delete('/:id', Auth(UserRole.ADMIN), userController.remove);

// Profile routes (All roles)
router.get(
  '/profile',
  Auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  userController.getProfile,
);
router.put(
  '/profile',
  Auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  userController.updateProfile,
);

export const userRoute = router;
