import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect';
import Waitlist from '../../../models/Waitlist';
import { withAuthentication } from '../../../utils/auth';

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const waitlist = await Waitlist.find({}, undefined, {
    sort: ['createdAt']
  })
  res.status(200).json(waitlist.map((w) => w.toJSON()));
});

export default handler;
