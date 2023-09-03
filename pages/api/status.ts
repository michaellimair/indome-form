import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';
import { EventStatus } from '../../customTypes';
import { getEventTierInfo } from '../../ticket-tiers';

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
    const tierInfo = await getEventTierInfo();
    const available = tierInfo.some((t) => t.available);
    const pendingAvailable = tierInfo.some((t) => t.pendingAvailable);
    
    const result: EventStatus = {
      available,
      pendingAvailable,
      tierInfo,
    };
    res.status(200).json(result);
  });
}
