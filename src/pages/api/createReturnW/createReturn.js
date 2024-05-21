import { createReturn } from '@/services/createReturn';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, returnLineItems, notifyCustomer, requestedAt } = req.body;

  try {
    const result = await createReturn(orderId, returnLineItems, notifyCustomer, requestedAt);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in creating return:', error);
    res.status(500).json({ error: error.message });
  }
}

/** PAYLOAD
{
  "orderId": "5281251557472",
  "returnLineItems": [
    {
      "fulfillmentLineItemId": "gid://shopify/FulfillmentLineItem/11309781385312",
      "quantity": 1,
      "returnReason": "WRONG_ITEM",
      "returnReasonNote": "Item arrived damaged"
    }
  ],
  "notifyCustomer": false,
  "requestedAt": "2024-05-21T18:20:00Z"
}
 
**/


// "gid://shopify/Return/12255297632" return ID