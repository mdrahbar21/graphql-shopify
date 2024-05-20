    import axios from 'axios';

    export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    const shopUrl = 'https://hoomanlab.myshopify.com';
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    try {
        const apiUrl = `${shopUrl}/admin/api/2024-04/orders/${orderId}/cancel.json`;

        const response = await axios.post(
        apiUrl,
        {}, 
        {
            headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
            },
        }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(error.response?.status || 500).json({ error: 'Failed to cancel order' });
    }
    }
