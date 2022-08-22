import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../models/Order';
import dbConnect from '../../../utils/dbConnect';
import { addMinutes } from 'date-fns';

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
    const orderCount = await Order.countDocuments({
      $or: [
        { filled: true },
        { filled: false, expiresAt: {
          $gt: new Date()
        } }
      ]
    });
    let price: number;
    if (orderCount < 20) {
      price = 20000;
    } else if (orderCount < 50) {
      price = 22500;
    } else if (orderCount < 115) {
      price = 25000;
    } else {
      res.status(400).json({
        message: 'No more available quota!',
      });
      return;
    }
    const order = await Order.create({
      expiresAt: addMinutes(new Date(), 15),
      price,
    });
  
    await order.save();
  
    res.status(201).json(order.toJSON());
  });
}
