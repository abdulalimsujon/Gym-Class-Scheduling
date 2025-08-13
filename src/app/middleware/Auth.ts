/* eslint-disable @typescript-eslint/no-explicit-any */
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
      if (!token) throw new Error('No token provided');

      if (token.startsWith('Bearer ')) token = token.split(' ')[1];

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as JwtPayload;

      const { id, role } = decoded;
      if (!id || !role) throw new Error('Invalid token payload');

      const user = await UserModel.findOne({ _id: id, isDeleted: false });
      if (!user) throw new Error('User not found or deleted');

      if (requiredRoles.length && !requiredRoles.includes(role)) {
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

      req.user = { id: user._id, role: user.role };
      next();
    } catch (err: any) {
      console.error('JWT verification error:', err.message || err);
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized access.',
        errorDetails: err.message.includes('jwt')
          ? 'Invalid or expired token.'
          : err.message,
      });
    }
  });
};

export default Auth;
