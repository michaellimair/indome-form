import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../../utils/dbConnect';
import Order from '../../../../../models/Order';
import { withAuthentication } from '../../../../../utils/auth';

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method?.toLowerCase() !== 'post') {
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

  if (!order.confirmed) {
    res.status(400).json({
      message: 'Order has to be completed first!',
    });
    return;
  }

  await order.update({
    checkedIn: true,
  });

  res.status(200).json(order.toJSON());
});

export default handler;
