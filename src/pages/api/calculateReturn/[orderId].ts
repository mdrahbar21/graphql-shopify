// pages/api/calculate-return/[orderId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateReturn } from '../../../services/calculateReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId } = req.query;
    const { returnLineItems } = req.body;

    try {
      const data = await calculateReturn(orderId as string, returnLineItems);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while calculating return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
