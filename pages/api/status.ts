import type { NextApiRequest, NextApiResponse } from 'next'
import { addMinutes } from 'date-fns';
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  await dbConnect();

  const orderCount = await Order.countDocuments({
    $or: [
      { filled: true },
      { filled: false, expiresAt: {
        $lt: new Date()
      } }
    ]
  });

  res.status(200).json({
    orderCount,
    available: orderCount < 115,
  });
}
