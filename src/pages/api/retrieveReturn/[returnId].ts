import type { NextApiRequest, NextApiResponse } from 'next';
import { retrieveReturn } from '../../../services/retrieveReturn';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { returnId } = req.query;

    try {
      const data = await retrieveReturn(returnId as string);
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while retrieving return', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
