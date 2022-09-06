import { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../../../models/Order";
import { withAuthentication } from "../../../../../utils/auth";
import dbConnect from "../../../../../utils/dbConnect";

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const orderId = req.query.orderId;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({
      message: 'Not found!',
    });
    return;
  }

  res.status(200).json(order.toJSON());
});

export default handler;
