import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import { getCompletedQuery, getPendingQuery } from '../../utils/db';
import { earlyBirdQuota, firstReleaseCloseTime, onlineQuota, secondReleaseCloseTime, secondReleaseOpenTime } from '../../constants';
import { EventStatus } from '../../customTypes';

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

    const currentDate = new Date();

    const firstReleaseOpen = currentDate < firstReleaseCloseTime;

    const result: EventStatus = {
      orderCount,
      // 60 pax early bird, first release open until Friday 10pm HKT
      firstReleaseAvailable: orderCount < earlyBirdQuota && firstReleaseOpen,
      firstReleaseOpen,
      // 150 pax maximum
      secondReleaseAvailable: orderCount < onlineQuota,
      secondReleaseOpen: false,
      // 150 pax, leave the rest for walk in
      available: false,
      pendingAvailable: false,
      finalised: true,
      pendingCount,
    };
    res.status(200).json(result);
  });
}
