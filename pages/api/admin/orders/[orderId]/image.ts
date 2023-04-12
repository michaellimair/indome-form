import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../../../models/Order';
import dbConnect from '../../../../../utils/dbConnect';
import { addMinutes } from 'date-fns';
import { indomeBucket } from '../../../../../utils/storage';
import jsonwebtoken from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const token = req.query.token;

  const verified = jsonwebtoken.verify(token as string, process.env.JWT_SECRET!, {
    algorithms: ['HS384'],
  }) as jsonwebtoken.JwtPayload;

  const order = await Order.findById(verified.sub!);

  if (!order || !order.paymentProofFileName) {
    res.status(404).json({
      message: 'Not Found!',
    });
    return;
  }

  const [url] = await indomeBucket.file(order!.paymentProofFileName).getSignedUrl({
    expires: addMinutes(new Date(), 5),
    version: 'v4',
    action: 'read'
  });

  res.redirect(url);
};

export default handler;
