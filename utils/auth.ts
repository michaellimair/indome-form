import { timingSafeEqual } from 'crypto';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { adminSecret } from '../constants';

if (!adminSecret) {
  throw new Error('Admin secret not in environment variable!');
}

export const withAuthentication = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  const authHeader = req.headers.authorization?.replace('Bearer ', '') ?? '';

  const maxLength = Math.max(adminSecret.length, authHeader.length);

  const isAuthenticated = timingSafeEqual(Buffer.from(authHeader.padStart(maxLength, '0')), Buffer.from(adminSecret.padStart(maxLength, '0')));

  if (!isAuthenticated) {
    res.status(401).json({
      message: 'Unauthorised!',
    });
    return;
  }

  return handler(req, res);
}