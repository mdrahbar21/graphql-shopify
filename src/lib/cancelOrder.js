
export async function cancelOrder(orderId) {
    const shopUrl = process.env.SHOPIFY_SHOP_URL;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    try {
        const apiUrl = `${shopUrl}/admin/api/2024-04/orders/${orderId}/cancel.json`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error cancelling order:', errorData);
            return { error: 'Failed to cancel order', status: response.status, details: errorData };
        }

        const responseData = await response.json();
        return { success: true, data: responseData };
    } catch (error) {
        console.error('Error cancelling order:', error);
        return { error: 'Failed to process request', status: 500, details: error.message };
    }
}

