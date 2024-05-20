import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductById } from '../../../services/getProductById';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { productId } = req.query;
      const product = await getProductById(productId as string);
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching product', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
