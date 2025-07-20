import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

interface SignPayload {
  [key: string]: any;
}

export const signToken = (
  payload: SignPayload,
  expiresIn: jwt.SignOptions['expiresIn'] = '1d',
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = <T = any>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};
