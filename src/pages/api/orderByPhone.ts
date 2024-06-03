// Import necessary types
import type { NextApiRequest, NextApiResponse } from 'next';


function formatAddress(address: { address1: string, address2: string, city: string, province: string, country: string, zip: string }): string {
    return [address.address1, address.address2, address.city, address.province, address.country, address.zip]
      .filter(part => part)
      .join(', ');
  }

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const shopUrl: string = process.env.SHOPIFY_SHOP_URL!;
    const accessToken: string = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
    const body = req.body || {};
    const phoneNumber: string = body.phoneNum ? body.phoneNum.toString() : '';
    console.log('phoneNumber: ' + phoneNumber);

    if (!phoneNumber) {
      return res.status(400).send('PhoneNumber is required and must be a valid string.');
    }

    const customersUrl: string = `${shopUrl}/admin/api/2024-04/customers.json?phone=+91${phoneNumber}`;
    const customerResponse = await fetch(customersUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!customerResponse.ok) {
      return res.status(customerResponse.status).send('Failed to fetch customers');
    }

    const customerData = await customerResponse.json();
    if (customerData.customers.length === 0) {
      return res.status(404).send('Customer not found');
    }

    const customer = customerData.customers[0];

    const ordersUrl: string = `${shopUrl}/admin/api/2024-04/orders.json?customer_id=${customer.id}`;
    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!ordersResponse.ok) {
      return res.status(ordersResponse.status).send('Failed to fetch orders');
    }

    const ordersData = await ordersResponse.json();
    const orders = ordersData.orders;

    let orderCategory: string = orders.length === 1 ?
      (orders[0].line_items.length === 1 ? 'single order single product' : 'single order multiple product') :
      'multiple order multiple product';

    const filteredOrders = orders.map((order:any) => ({
      id: order.id,
      customer_name: `${customer.first_name} ${customer.last_name}`,
      phone: customer.phone,
      default_address: formatAddress(customer.default_address),
      billing_address: formatAddress(order.billing_address),
      line_items: order.line_items.map((item:any) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity
      }))
    }));

    

    let responseString = `${orderCategory}, ${'\n'}orders: [${JSON.stringify(filteredOrders)}]`;

    // Correctly send a JSON response with the formatted string
    return res.status(200).json({ success: true, message: responseString });

  } catch (error:any) {
    console.error('Shopify API error:', error);
    return res.status(500).send('Failed to process request ' + error.toString());
  }
}
