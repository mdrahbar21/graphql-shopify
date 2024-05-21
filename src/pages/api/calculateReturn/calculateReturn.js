// Import the function from wherever it is defined
import { calculateReturnFinancials } from  '@/services/calculateReturn'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Only allow POST requests
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const input = req.body;
        const result = await calculateReturnFinancials(input);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error calculating return financials:', error);
        res.status(500).json({ error: error.message });
    }
}
