import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send(req.method + ' METHOD NOT ALLOWED');
    }

    const { orderId, quantity, line_item_id } = req.body;
    if (!orderId || quantity == null || !line_item_id) {
        return res.status(400).send('Missing required parameters');
    }

    const shopUrl = `https://hoomanlab.myshopify.com/admin/api/2024-04/orders/${orderId}/refunds/calculate.json`;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    const refund = {
        refund: {
            shipping: { full_refund: false },
            refund_line_items: [
                {
                    line_item_id,
                    quantity,
                    restock_type: 'no_restock'
                }
            ]
        }
    };

    try {
        const response = await axios.post(shopUrl, refund, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
        return res.json(response.data);
    } catch (error) {
        console.error('Failed to process refund:', error);
        return res.status(500).send('Internal Server Error');
    }
}
