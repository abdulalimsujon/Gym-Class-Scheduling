/* eslint-disable @typescript-eslint/no-namespace */
import { JwtPayload } from 'jsonwebtoken';
declare module 'cookie-parser';
declare module 'jsonwebtoken';
declare module 'bcrypt';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
