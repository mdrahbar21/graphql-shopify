import { POST } from "@/lib/OrderByPhone";

import { fetchCustomerOrders } from '../../lib/shopify';

export default async function handler(req, res) {
    try {
        const body = req.body || await req.json() || {}; 
        const phoneNumber = body.phoneNum ? body.phoneNum.toString() : ''; 
        if (!phoneNumber) {
            // If phoneNumber is still not valid, return error
            return res.status(400).json({ error: 'PhoneNumber is required and must be a valid string.' });
        }

        const result = await POST(phoneNumber);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        // Respond with the fetched data
        return res.status(200).json(result);
    } catch (e) {
        console.error("Server Error: ", e);
        return res.status(500).json({ error: 'Server Error', message: e.toString() });
    }
}
