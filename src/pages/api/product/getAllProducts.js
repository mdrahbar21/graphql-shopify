import { getAllProducts } from '@/services/allProduct';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const products = await getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Failed to fetch products', error: error.message });
        }
    }
}
