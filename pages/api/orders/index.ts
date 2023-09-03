import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../models/Order';
import dbConnect from '../../../utils/dbConnect';
import { addMinutes } from 'date-fns';
import { getEventTierInfo } from '../../../ticket-tiers';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  const db = await dbConnect();
  const session = await db.startSession();

  await session.withTransaction(async () => {
    const tierInfo = await getEventTierInfo();
    const firstAvailableTier = tierInfo.find((e) => e.available);

    if (firstAvailableTier) {
      const { price, tier } = firstAvailableTier;
      const order = await Order.create({
        expiresAt: addMinutes(new Date(), 15),
        price,
        tier,
      });  
      res.status(201).json(order.toJSON());  
    } else {
      res.status(400).json({
        message: 'No more available online quota! Please proceed to walk-in.',
      });
    }
  });
}
