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

  if (req.method?.toLowerCase() === 'get') {
    res.status(200).json(order.toJSON());
  } else if (req.method?.toLowerCase() === 'delete') {
    await order.delete();
    res.status(204).end();
  }
});

export default handler;
