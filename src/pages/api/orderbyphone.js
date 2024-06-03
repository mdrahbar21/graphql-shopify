export default async function handler(req, res) {
  try {
      const shopUrl = process.env.SHOPIFY_SHOP_URL;
      const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
      const body = req.body || {};  // If your setup does not parse JSON by default, ensure this is handled correctly
      const phoneNumber = body.phoneNum ? body.phoneNum.toString() : ''; 

      if (!phoneNumber) {
          // Return HTTP response with error
          return res.status(400).json({ error: 'PhoneNumber is required and must be a valid string.' });
      }

      const customersUrl = `${shopUrl}/admin/api/2024-04/customers.json?phone=${phoneNumber}`;
      const customerResponse = await fetch(customersUrl, {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
      });

      if (!customerResponse.ok) {
          return res.status(customerResponse.status).json({ error: 'Failed to fetch customers' });
      }

      const customerData = await customerResponse.json();
      if (customerData.customers.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
      }

      const customer = customerData.customers[0];  // Assuming the first match is the desired one

      // Fetch orders for the matched customer ID
      const ordersUrl = `${shopUrl}/admin/api/2024-04/orders.json?customer_id=${customer.id}`;
      const ordersResponse = await fetch(ordersUrl, {
          headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
          }
      });

      if (!ordersResponse.ok) {
          return res.status(ordersResponse.status).json({ error: 'Failed to fetch orders' });
      }

      const ordersData = await ordersResponse.json();
      const orders = ordersData.orders;

      let orderCategory = orders.length === 1 ?
          (orders[0].line_items.length === 1 ? 'single order single product' : 'single order multiple product') :
          'multiple order multiple product';

      const filteredOrders = orders.map(order => ({
          id: order.id,
          customer_name: `${customer.first_name} ${customer.last_name}`,
          phone: customer.phone,
          default_address: formatAddress(customer.default_address),
          billing_address: formatAddress(order.billing_address),
          line_items: order.line_items.map(item => ({
              product_id: item.product_id,
              name: item.name,
              quantity: item.quantity
          }))
      }));

      function formatAddress(address) {
          return [address.address1, address.address2, address.city, address.province, address.country, address.zip]
              .filter(part => part)
              .join(', ');
      }

      res.status(200).json({ category: orderCategory, orders: filteredOrders });
    
  } catch (error) {
      console.error('Shopify API error:', error);
      res.status(500).json({ error: 'Failed to process request', message: error.toString() });
  }
}