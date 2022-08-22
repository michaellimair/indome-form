import { Fields, Files, IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next';
import Order from '../../../../models/Order';
import { Storage } from '@google-cloud/storage';
import { isAfter } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime';
import dbConnect from '../../../../utils/dbConnect';

const serviceAccount = process.env.INDOME_GCP_SERVICE_ACCOUNT!;
const bucketName = process.env.INDOME_GCP_BUCKET!;

const storage = new Storage(serviceAccount ? {
  credentials: JSON.parse(serviceAccount),
} : {});

if (!bucketName) {
  throw new Error('Please configure the bucket name setting!');
}

const bucket = storage.bucket(bucketName);

export const config = {
  api: {
    bodyParser: false,
  }
};

class FilledError extends Error {
  constructor() {
    super('Order is already complete!')
  }
}

class NotFoundError extends Error {
  constructor() {
    super('Order not found!');
  }
}

class ExpiredError extends Error {
  constructor() {
    super('Order expired!');
  }
}

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
  });

  const orderId = req.query.orderId;

  const db = await dbConnect();
  const session = await db.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const order = await Order.findById(orderId);
  
      if (!order) {
        throw new NotFoundError();
      }
    
      if (isAfter(new Date(), order.expiresAt)) {
        throw new ExpiredError();
      }

      if (order.filled) {
        throw new FilledError();
      }    
    
      const fileObj = data.files.file;
    
      const file = Array.isArray(fileObj) ? fileObj[0] : fileObj;
    
      const baseName = `${uuidv4()}.${mime.getExtension(file.mimetype!)}`;
      await bucket.upload(file.filepath!, {
        destination: baseName,
      });
    
      await Order.updateOne({
        _id: orderId,
      }, {
        filled: true,
        paymentProofFileName: baseName,
        paymentMethod: data.fields.paymentMethod,
      }, {
        runValidators: true,
      });

      res.status(200).json(await Order.findById(orderId).then((it) => it!.toJSON()));  
    });
    } catch (e) {
    console.error(e);
    if (e instanceof ExpiredError) {
      res.status(410).json({
        message: 'Order is expired!',
      });
      return;  
    }
    if (e instanceof NotFoundError) {
      res.status(404).json({
        message: 'Order not found!',
      });
      return;
    }
    if (e instanceof FilledError) {
      res.status(400).json({
        message: 'Not allowed to update complete order!',
      });
      return;
    }
    throw e;
  }
}
