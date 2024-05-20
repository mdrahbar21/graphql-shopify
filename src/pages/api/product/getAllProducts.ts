import { getAllProducts } from '../../../services/allProduct';

export default async function handler(req:any, res:any) {
  if (req.method === 'GET') {
    try {
      const products = await getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
