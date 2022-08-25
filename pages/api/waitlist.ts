import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';
import Waitlist from '../../models/Waitlist';
import { pick } from 'lodash';
import { verifyCaptcha } from '../../utils/captcha';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;
  }

  const recaptchaKey = req.body.recaptchaKey;

  if (!recaptchaKey) {
    res.status(403).json({
      message: 'Forbidden!',
    });
    return;
  }

  const captchaVerified = await verifyCaptcha(recaptchaKey);

  if (!captchaVerified) {
    res.status(403).json({
      message: 'Captcha validation failed!',
    });
    return;
  }

  await dbConnect();
  const waitlist = await Waitlist.create(pick(req.body, ['name', 'phone', 'email']))

  res.status(200).json(waitlist.toJSON());
}
