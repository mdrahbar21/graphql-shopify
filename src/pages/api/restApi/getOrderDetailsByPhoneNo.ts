import axios from 'axios';

export default async function handler(req:any, res:any) {
    // const startTime = Date.now();
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { phoneNumber } = req.body; 
  const shopUrl = 'https://hoomanlab.myshopify.com';
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    // Step 1: Fetch all customers
    const customersUrl = `${shopUrl}/admin/api/2024-04/customers.json`;
    const { data: { customers } } = await axios.get(customersUrl, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    });

    // Step 2: Find the customer ID by phone number
    const customer = customers.find((c:any) => c.phone === phoneNumber);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Step 3: Fetch orders for the matched customer ID
    const ordersUrl = `${shopUrl}/admin/api/2024-04/orders.json?customer_id=${customer.id}`;
    const { data: { orders } } = await axios.get(ordersUrl, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    });

    // Step 4: Filter and return the necessary order details, including concatenated full_address
    const filteredOrders = orders.map((order:any) => {
      const defaultAddress = order.customer.default_address;
      const billingAddress = order.billing_address;

      // Concatenate address components into full_address
      const formatAddress = (address:any) => {
        return [address.address1, address.address2, address.city, address.province, address.country, address.zip]
          .filter(part => part) 
          .join(', ');
      };

      return {
        id: order.id,
        customer_name: customer.first_name + ' ' + customer.last_name,
        phone: order.phone,
        default_address: formatAddress(defaultAddress),
        billing_address: formatAddress(billingAddress),
        line_items: order.line_items.map((item:any) => ({
          product_id: item.product_id,
          name: item.name
        }))
      };
    });
    // const endTime = Date.now(); // Capture end time
    // console.log(`Execution time: ${endTime - startTime}ms`);
    // res.status(200).json({ message: 'Function executed successfully', duration: `${endTime - startTime}ms` });

    return res.status(200).json({ orders: filteredOrders });

  } catch (error) {
    console.error('Shopify API error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
  
}
