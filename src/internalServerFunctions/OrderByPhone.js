// const shopUrl = process.env.SHOPIFY_SHOP_URL;
const shopUrl=process.env.SHOPIFY_SHOP_URL;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(phoneNumber) {
  try {
    // Fetch customers by phone number
    const customersUrl = `${shopUrl}/admin/api/2024-04/customers.json?phone=${phoneNumber}`;
    const customerResponse = await fetch(customersUrl, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });
      if (!customerResponse.ok) {
        return { error: 'Failed to fetch customers', status: customerResponse.status };
      }
      const customerData = await customerResponse.json();
      const customers = customerData.customers;

    // Check if any customer is found
    if (customers.length === 0) {
      return { error: 'Customer not found', status: 404 };
    }

    const customer = customers[0]; // Assuming the first match is the desired one

    // Fetch orders for the matched customer ID
    const ordersUrl = `${shopUrl}/admin/api/2024-04/orders.json?customer_id=${customer.id}`;
    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!ordersResponse.ok) {
      return { error: 'Failed to fetch orders', status: ordersResponse.status };
    }
    const ordersData = await ordersResponse.json();
    const orders = ordersData.orders;

    let orderCategory = '';
    if (orders.length === 1) {
      orderCategory = orders[0].line_items.length === 1 ? 'single order single product' : 'single order multiple product';
    } else {
      orderCategory = 'multiple order multiple product';
    }

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

    return { category: orderCategory, orders: filteredOrders, status: 200 };

  } catch (error) {
    console.error('Shopify API error:', error);
    return { error: 'Failed to process request', status: 500 };
  }
}

