import type { NextApiRequest, NextApiResponse } from 'next';
import { requestReturn } from '../../../services/requestReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId } = req.query;
    const { returnLineItems, returnShippingFee } = req.body;

    try {
      const data = await requestReturn(orderId as string, returnLineItems, returnShippingFee);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while requesting return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
