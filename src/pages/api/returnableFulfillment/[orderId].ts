import type { NextApiRequest, NextApiResponse } from 'next';
import { getReturnableFulfillments } from '../../../services/returnableFulfillment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { orderId } = req.query;

    try {
      const data = await getReturnableFulfillments(orderId as string);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching returnable fulfillments', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
