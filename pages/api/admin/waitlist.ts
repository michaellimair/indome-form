import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect';
import { timingSafeEqual } from 'crypto';
import Waitlist from '../../../models/Waitlist';

const adminSecret = process.env.INDOME_ADMIN_SECRET!;

if (!adminSecret) {
  throw new Error('Admin secret not in environment variable!');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  await dbConnect();
  const waitlist = await Waitlist.find({}, undefined, {
    sort: ['createdAt']
  })
  res.status(200).json(waitlist.map((w) => w.toJSON()));
}