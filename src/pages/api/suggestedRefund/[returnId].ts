import type { NextApiRequest, NextApiResponse } from 'next';
import { querySuggestedRefund } from '../../../services/suggestedRefund';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { returnId } = req.query;
    const { returnLineItems } = req.body;

    try {
      const data = await querySuggestedRefund(returnId as string, returnLineItems);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while querying suggested refund', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
