import { Fields, Files, IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await new Promise<{  
    fields: Fields,
    files: Files,
  }>((resolve, reject) => {
    const form = new IncomingForm()
    
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}
