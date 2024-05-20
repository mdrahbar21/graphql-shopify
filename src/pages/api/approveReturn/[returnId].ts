import type { NextApiRequest, NextApiResponse } from 'next';
import { approveReturn } from '../../../services/approveReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { returnId } = req.query;

    try {
      const data = await approveReturn(returnId as string);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while approving return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
