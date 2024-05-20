import type { NextApiRequest, NextApiResponse } from 'next';
import { declineReturn } from '../../../services/declineReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { returnId } = req.query;
    const { declineReason } = req.body;

    try {
      const data = await declineReturn(returnId as string, declineReason);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while declining return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
