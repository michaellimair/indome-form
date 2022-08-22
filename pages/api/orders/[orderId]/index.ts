import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../../models/Order';
import dbConnect from '../../../../utils/dbConnect';
import { isAfter } from 'date-fns';
import { pick } from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['patch', 'get'].includes(req?.method?.toLowerCase() ?? '')) {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;  
  }
  await dbConnect();

  const orderId = req.query.orderId;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({
      message: 'Not found!',
    });
    return;
  }

  if (req?.method?.toLowerCase() === 'patch') {
    if (isAfter(new Date(), order.expiresAt)) {
      res.status(410).json({
        message: 'Order is expired!',
      });
      return;
    }  

    if (order.filled) {
      res.status(400).json({
        message: 'Not allowed to update complete order!',
      });
      return;
    }  

    const body = pick(req.body, ['name', 'email', 'phone', 'acknowledgeAgeRequirement', 'acknowledgeVaccineRequirement'])

    await Order.updateOne({
      _id: orderId
    }, body, {
      runValidators: true,
    });  
  }

  res.status(200).json(order.toJSON());
}
