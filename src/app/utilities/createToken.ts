import jwt from 'jsonwebtoken';
import config from '../config';

// Ensure expiresIn matches jwt.SignOptions type
const expiresIn: jwt.SignOptions['expiresIn'] =
  (config.jwt_expires_in as jwt.SignOptions['expiresIn']) || '1h';

export const createToken = (payload: Record<string, unknown>) => {
  if (!config.jwt_secret) {
    throw new Error('JWT secret is not defined in config');
  }

  return jwt.sign(payload, config.jwt_secret, { expiresIn });
};
