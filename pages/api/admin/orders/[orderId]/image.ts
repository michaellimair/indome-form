import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../../../models/Order';
import dbConnect from '../../../../../utils/dbConnect';
import { addMinutes } from 'date-fns';
import { indomeBucket } from '../../../../../utils/storage';
import { withAuthentication } from '../../../../../utils/auth';

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

export default handler;
