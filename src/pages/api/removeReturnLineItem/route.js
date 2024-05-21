import { removeReturnLineItems } from '../../../services/removeReturnLineItems';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { returnId, returnLineItems } = req.body;

  if (!returnId || !returnLineItems) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const result = await removeReturnLineItems(returnId, returnLineItems);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error in removing return line items:', error);
      res.status(500).json({ error: error.message });
  }
}

/*
Functionality Removed from new version
*/