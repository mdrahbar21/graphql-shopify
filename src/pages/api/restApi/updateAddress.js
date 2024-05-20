import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { customerId, addressId } = req.query; 
  const addressData = req.body; 

  const shopUrl = 'https://hoomanlab.myshopify.com/admin/api/2024-04';
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN; 

  try {
    // Update the address
    const updateResponse = await axios.put(
      `${shopUrl}/customers/${customerId}/addresses/${addressId}.json`,
      { address: addressData }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );

    const defaultResponse = await axios.put(
      `${shopUrl}/customers/${customerId}/addresses/${addressId}/default.json`,
      {}, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );

    return res.status(200).json({ message: 'Address updated and set as default successfully', data: updateResponse.data });
  } catch (error) {
    console.error('Shopify API error:', error.response ? error.response.data : error.message);
    return res.status(error.response ? error.response.status : 500).json({
      error: 'Failed to update customer address',
      details: error.response ? error.response.data : error.message,
    });
  }
}
