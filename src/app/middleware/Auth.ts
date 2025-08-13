import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utilities/catchAsync';
import httpStatus from 'http-status';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const Auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized access.',
          errorDetails: 'No token provided.',
        });
      }

      // Allow "Bearer <token>"
      if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      // Verify token
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          token,
          config.jwtAcessToken as string,
        ) as JwtPayload;
      } catch {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized access.',
          errorDetails: 'Invalid or expired token.',
        });
      }

      const { role, id } = decoded;
      if (!id || !role) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized access.',
          errorDetails: 'Invalid token payload.',
        });
      }

      // Ensure user exists and is not soft-deleted
      const user = await UserModel.findOne({ _id: id, isDeleted: false });
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized access.',
          errorDetails: 'User not found or deleted.',
        });
      }

      // Check role
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        const roleNames =
          requiredRoles.length === 1
            ? requiredRoles[0].toLowerCase()
            : requiredRoles.map((r) => r.toLowerCase()).join(' or ');

        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'Unauthorized access.',
          errorDetails: `You must be ${roleNames} to perform this action.`,
        });
      }

      // Attach user to request
      req.user = { id: user._id, role: user.role };

      next();
    } catch (err) {
      next(err);
    }
  });
};

export default Auth;
