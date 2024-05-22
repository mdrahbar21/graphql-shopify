import { approveReturn } from '../../../services/approveReturn';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { returnId } = req.body;
    if (!returnId) {
      res.status(400).json({ error: "Missing returnId in request body" });
      return;
    }
    const result = await approveReturn(returnId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error approving return:', error);
    res.status(500).json({ message: 'Failed to approve return', error: error.message });
  }
}
