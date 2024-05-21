import axios from 'axios';

export default async function handler(req, res) {
  const shopUrl = 'https://hoomanlab.myshopify.com/admin/api/2024-04/customers.json';
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const phoneNumber = req.query.phoneNumber;

  try {
    const { data } = await axios.get(shopUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });

    if (phoneNumber) {
      const customer = data.customers.find(c => c.phone === phoneNumber);
      if (customer) {
        const result = {
          name: `${customer.first_name} ${customer.last_name}`,
          id: customer.id,
          phone: customer.phone,
          addresses: customer.addresses.map(address => ({
            id: address.id,
            full_address: [
              address.address1,
              address.address2,
              address.city,
              address.province,
              address.country,
              address.zip
            ].filter(Boolean).join(', ')  
          }))
        };
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'No customer found with the provided phone number' });
      }
    } else {
      const customers = data.customers.map(c => ({
        name: `${c.first_name} ${c.last_name}`,
        id: c.id,
        phone: c.phone || null,
        addresses: c.addresses.map(address => ({
          id: address.id,
          full_address: [
            address.address1,
            address.address2,
            address.city,
            address.province,
            address.country,
            address.zip
          ].filter(Boolean).join(', ')  
        }))
      }));
      return res.status(200).json(customers);
    }
  } catch (error) {
    console.error('Shopify API error:', error);
    res.status(500).json({ error: 'Failed to fetch customer data' });
  }
}

