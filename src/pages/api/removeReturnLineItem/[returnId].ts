// pages/api/remove-return-line-items/[returnId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { removeReturnLineItems } from '../../../services/removeReturnLineItems';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { returnId } = req.query;
    const { returnLineItems } = req.body;

    try {
      const data = await removeReturnLineItems(returnId as string, returnLineItems);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while removing return line items', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
