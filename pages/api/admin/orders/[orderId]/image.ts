import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../../../models/Order';
import dbConnect from '../../../../../utils/dbConnect';
import { addMinutes } from 'date-fns';
import { timingSafeEqual } from 'crypto';
import { indomeBucket } from '../../../../../utils/storage';

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

  const authHeader = req.query.token! as string;

  const maxLength = Math.max(adminSecret.length, authHeader.length);

  const isAuthenticated = timingSafeEqual(Buffer.from(authHeader.padStart(maxLength, '0')), Buffer.from(adminSecret.padStart(maxLength, '0')));

  if (!isAuthenticated) {
    res.status(401).json({
      message: 'Unauthorised!',
    });
    return;
  }

  await dbConnect();
  const order = await Order.findById(req.query.orderId);

  if (!order || !order.paymentProofFileName) {
    res.status(404).json({
      message: 'Not Found!',
    });
  }

  const [url] = await indomeBucket.file(order!.paymentProofFileName).getSignedUrl({
    expires: addMinutes(new Date(), 5),
    version: 'v4',
    action: 'read'
  });

  res.redirect(url);
}
