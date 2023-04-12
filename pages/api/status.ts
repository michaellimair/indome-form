import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import { getCompletedQuery, getPendingQuery } from '../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  const db = await dbConnect();
  const session = await db.startSession();
  await session.withTransaction(async () => {
    const completedCount = await Order.countDocuments(getCompletedQuery());
    const pendingCount = await Order.countDocuments(getPendingQuery());
    const orderCount = pendingCount + completedCount;
    res.status(200).json({
      orderCount,
      // 60 pax early bird
      firstReleaseAvailable: orderCount < 60,
      // 150 pax maximum
      secondReleaseAvailable: orderCount < 150,
      // 200 pax or the whole place is packed as hell
      available: orderCount < 200,
      finalised: completedCount < 200,
      pendingCount,
    });
  });
}
