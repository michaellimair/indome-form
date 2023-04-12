import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import { getCompletedQuery, getPendingQuery } from '../../utils/db';
import { earlyBirdQuota, onlineQuota } from '../../constants';

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
      firstReleaseAvailable: orderCount < earlyBirdQuota,
      // 150 pax maximum
      secondReleaseAvailable: orderCount < onlineQuota,
      // 150 pax, leave the rest for walk in
      available: orderCount < onlineQuota,
      finalised: completedCount < onlineQuota,
      pendingCount,
    });
  });
}
