// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { VerifyVaccineResult } from '../../customTypes';
import { verifyVaccine } from '../../utils/vaccine';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyVaccineResult>
) {
  const qrString = req.body?.qrString;

  res.status(200).json(verifyVaccine(qrString));
}
