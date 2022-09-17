import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect';
import { withAuthentication } from '../../../utils/auth';
import Order from '../../../models/Order';
import { IStatistics } from '../../../global';

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse<IStatistics>) => {
  await dbConnect();
  const [
    totalAttendees,
    checkedInAttendees,
  ] = await Promise.all([
    Order.count({ confirmed: true }),
    Order.count({ confirmed: true, checkedIn: true }),
  ]);
  res.status(200).json({
    totalAttendees,
    checkedInAttendees,
  });
});

export default handler;
