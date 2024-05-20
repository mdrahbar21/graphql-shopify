import type { NextApiRequest, NextApiResponse } from 'next';
import { returnProductAndInitiateRefund } from '../../../services/returnProduct';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { orderId } = req.query;
    const { lineItems } = req.body; // Expect an array of { id: string, quantity: number }

    try {
      const refundResponse = await returnProductAndInitiateRefund(orderId as string, lineItems);
      res.status(200).json(refundResponse);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while processing return and refund', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
