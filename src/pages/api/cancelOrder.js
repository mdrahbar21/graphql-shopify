import { cancelOrder } from "@/lib/cancelOrder";

export default async function handler(req, res) {

    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({success:false, message: 'Order ID is required' });
    }

    const result = await cancelOrder(orderId);

    if (result.error) {
        console.error('Error cancelling order:', result.details);
        return res.status(result.status).json({success: false, message: result.error });
    }
    const ans=JSON.stringify(result.data)
    return res.status(200).json({success: false, message: ans});
}
