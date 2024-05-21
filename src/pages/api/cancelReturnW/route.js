import { cancelReturn } from '@/services/cancelReturn';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { returnId, notifyCustomer } = req.body;

  if (!returnId) {
    return res.status(400).json({ message: "Missing required parameter: returnId" });
  }

  const notifyCustomerBoolean = notifyCustomer === true || notifyCustomer === 'true';

  try {
    const data = await cancelReturn(returnId, notifyCustomerBoolean);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error while canceling return:', error);
    res.status(500).json({ message: 'Server error while canceling return', error: error.message });
  }
};
