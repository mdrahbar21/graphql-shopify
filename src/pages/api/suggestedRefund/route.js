import { querySuggestedRefund } from '@/services/suggestedRefund'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { returnId } = req.body;

  if (!returnId) {
    res.status(400).json({ message: "Missing required parameter: returnId" });
    return;
  }

  try {
    const data = await querySuggestedRefund(returnId);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error while querying suggested refund:', error);
    res.status(500).json({ message: 'Server error while querying suggested refund', error: error.message });
  }
}

