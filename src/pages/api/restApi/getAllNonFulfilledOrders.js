import axios from 'axios';

export default async function handler(req, res) {
  const shopUrl = 'https://hoomanlab.myshopify.com/admin/api/2024-04/orders.json';
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    const { data } = await axios.get(shopUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });

    // Extract and structure the required data from each order
    const ordersData = data.orders.map(order => ({
      orderId: order.id,
      customerId: order.customer?.id,
      customerName: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'N/A', 
      customerPhone: order.customer?.phone || 'N/A',
      line_items: order.line_items.map(item => ({
        name: item.name,
        productId: item.product_id, // Assuming item.product_id contains the product ID
      })),
    }));

    res.status(200).json(ordersData);
  } catch (error) {
    console.error('Shopify API error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
