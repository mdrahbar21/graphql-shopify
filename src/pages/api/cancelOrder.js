import { cancelOrder } from "@/lib/cancelOrder";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    const result = await cancelOrder(orderId);

    if (result.error) {
        console.error('Error cancelling order:', result.details);
        return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result.data);
}
