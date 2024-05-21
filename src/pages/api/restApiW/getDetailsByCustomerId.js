export default async function handler(req, res) {
    const { customerId } = req.query;
  
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
  
    const shopUrl = `https://hoomanlab.myshopify.com/admin/api/2024-04/customers/${customerId}.json`;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
    try {
      const response = await fetch(shopUrl, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data for customer ID ${customerId}`);
      }
  
      // const data = await response.json();
      // res.status(200).json(data);
      const { customer } = await response.json();
      const customerData = {
        name: `${customer.first_name} ${customer.last_name}`,
        id: customer.id,
        phone: customer.phone,
        address: customer.default_address ? {
          id: customer.default_address.id,
          address1: customer.default_address.address1,
          address2: customer.default_address.address2,
          city: customer.default_address.city,
          province: customer.default_address.province,
          country: customer.default_address.country,
          zip: customer.default_address.zip,
          province_code: customer.default_address.province_code,
          country_code: customer.default_address.country_code,
          country_name: customer.default_address.country_name,
        } : null, // Handle case where default_address might be missing
      };
      res.status(200).json(customerData);
    } catch (error) {
      console.error('Shopify API error:', error);
      res.status(500).json({ error: `Failed to fetch data for customer ID ${customerId}`, details: error.message });
    }
  }
  