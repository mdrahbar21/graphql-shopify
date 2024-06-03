import { getDetails } from "@/services/getDetails";

export default async function handler(req, res) {
    // if (req.method !== 'GET') {
    //     return res.status(405).end('Method Not Allowed');
    // }
    
    const { orderId } = req.query;
    
    try {
        const data = await getDetails(orderId);
        const ans= JSON.stringify(data)
        return res.status(200).json({success: true, message: ans});
    } catch (error) {
        console.error('Error fetching order details:', error);
        return res.status(500).json({ success:false, message: 'Failed to fetch order details' });
    }
}