import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from 'jsonwebtoken';
import Order from "../../../../models/Order";
import { withAuthentication } from "../../../../utils/auth";
import dbConnect from "../../../../utils/dbConnect";
import { IOrder } from "../../../../global";

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method?.toLowerCase() !== 'post') {
    res.status(405).json({
      message: 'Not allowed!',
    });
    return;
  }

  await dbConnect();


  let order: IOrder | null = null;

  const email = req.body.email;
  const phone = req.body.phone;

  if (!email && !phone) {
    res.status(400).json({
      message: "Email or phone is required!",
    });
    return;
  }

  if (email) {
    order = await Order.findOne({ email });
  }

  if (phone) {
    order = await Order.findOne({ phone });
  }

  if (!order) {
    res.status(404).json({
      message: 'Not found!',
    });
    return;
  }

  res.status(200).json(order);
});

export default handler;
