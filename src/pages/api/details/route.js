import { getDetails } from "@/services/getDetails";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end('Method Not Allowed');
    }
    
    const { orderId } = req.query;
    
    try {
        const data = await getDetails(orderId);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
}