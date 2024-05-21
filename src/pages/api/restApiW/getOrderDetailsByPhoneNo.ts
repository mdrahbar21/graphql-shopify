import axios from 'axios';

export default async function handler(req:any, res:any) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { phoneNumber } = req.body; 
  const shopUrl = 'https://hoomanlab.myshopify.com';
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    // Fetch customers by phone number
    const customersUrl = `${shopUrl}/admin/api/2024-04/customers.json?phone=${phoneNumber}`;
    const customerResponse = await axios.get(customersUrl, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    });
    const customers = customerResponse.data.customers;

    // Check if any customer is found
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = customers[0]; // Assuming the first match is the desired one

    // Fetch orders for the matched customer ID
    const ordersUrl = `${shopUrl}/admin/api/2024-04/orders.json?customer_id=${customer.id}`;
    const ordersResponse = await axios.get(ordersUrl, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    });
    const orders = ordersResponse.data.orders;

    // Process and return order details
    const filteredOrders = orders.map((order:any) => {
      const formatAddress = (address:any) => {
        return [address.address1, address.address2, address.city, address.province, address.country, address.zip]
          .filter(part => part) 
          .join(', ');
      };

      return {
        id: order.id,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        phone: customer.phone,
        default_address: formatAddress(customer.default_address),
        billing_address: formatAddress(order.billing_address),
        line_items: order.line_items.map((item:any) => ({
          product_id: item.product_id,
          name: item.name
        }))
      };
    });

    return res.status(200).json({ orders: filteredOrders });

  } catch (error) {
    console.error('Shopify API error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
