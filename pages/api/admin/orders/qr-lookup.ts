import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from 'jsonwebtoken';
import Order from "../../../../models/Order";
import { withAuthentication } from "../../../../utils/auth";
import dbConnect from "../../../../utils/dbConnect";

const handler = withAuthentication(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method?.toLowerCase() !== 'post') {
    res.status(405).json({
      message: 'Not allowed!',
    });
    return;
  }

  await dbConnect();


  let orderId: string;

  try {
    const code = req.body.code;
    const verified = jsonwebtoken.verify(code, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jsonwebtoken.JwtPayload;
    if (verified.iss !== 'indome') {
      throw new Error();
    }
    orderId = verified.sub!;
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: 'Code is not valid!',
    });
    return;
  }

  const order = await Order.findById(orderId, {
    checkedIn: true,
  });

  if (!order) {
    res.status(404).json({
      message: 'Not found!',
    });
    return;
  }

  res.status(200).json(order);
});

export default handler;
