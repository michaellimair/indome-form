import type { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../../../models/Order';
import dbConnect from '../../../../utils/dbConnect';
import jsonwebtoken from 'jsonwebtoken';
import { getCompletedQuery, getPendingQuery } from '../../../../utils/db';
import { withAuthentication } from '../../../../utils/auth';
import { adminSecret } from '../../../../constants';

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const orders = await Order.find(req.query.pending === 'true' ? getPendingQuery() : getCompletedQuery(), undefined, {
    sort: ['createdAt']
  });

  res.status(200).json(orders.map((it) => ({
    ...it.toJSON(),
    imageToken: jsonwebtoken.sign({
      sub: it.id
    }, adminSecret, {
      expiresIn: '5m',
      algorithm: 'HS384'
    })
  })));
})

export default handler;
