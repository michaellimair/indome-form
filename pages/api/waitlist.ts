import type { NextApiRequest, NextApiResponse } from 'next'
import { addMinutes } from 'date-fns';
import dbConnect from '../../utils/dbConnect';
import Waitlist from '../../models/Waitlist';
import { pick } from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  await dbConnect();
  const waitlist = await Waitlist.create(pick(req.body, ['name', 'phone', 'email']))

  res.status(200).json(waitlist.toJSON());
}
