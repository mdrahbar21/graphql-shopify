import type { NextApiRequest, NextApiResponse } from 'next';
import { createReturn } from '../../../services/createReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId } = req.query;
    const { returnLineItems, exchangeLineItems, returnShippingFee } = req.body;

    try {
      const data = await createReturn(orderId as string, returnLineItems, exchangeLineItems, returnShippingFee);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while creating return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
