import { issueRefund } from '@/services/issueRefund';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { returnId, returnRefundLineItems, refundShipping, refundDuties, orderTransactions } = req.body;
        const refundResult = await issueRefund(returnId, returnRefundLineItems, refundShipping, refundDuties, orderTransactions);
        res.status(200).json(refundResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to issue the refund", error: error.message });
    }
}
