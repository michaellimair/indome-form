import type { NextApiRequest, NextApiResponse } from 'next'
import url from 'url';
import dbConnect from '../../utils/dbConnect';
import Waitlist from '../../models/Waitlist';
import { pick } from 'lodash';
import axios from 'axios';

if (!process.env.RECAPTCHA_SECRET) {
  throw new Error('ReCaptcha v3 secret is not configured correctly!');
}

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

  const params = new url.URLSearchParams({
    response: recaptchaKey,
    secret: process.env.RECAPTCHA_SECRET!,
  });
  const captcha = await axios.post<{ success: boolean }>('https://www.google.com/recaptcha/api/siteverify', params.toString());

  console.log(captcha.data);

  if (!captcha.data.success) {
    res.status(403).json({
      message: 'Captcha validation failed!',
    });
    return;
  }

  await dbConnect();
  const waitlist = await Waitlist.create(pick(req.body, ['name', 'phone', 'email']))

  res.status(200).json(waitlist.toJSON());
}
