// pages/api/issue-refund/[returnId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { issueRefund } from '../../../services/issueRefund';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { returnId } = req.query;
    const { returnRefundLineItems, refundShipping, refundDuties, orderTransactions } = req.body;

    try {
      const data = await issueRefund(
        returnId as string,
        returnRefundLineItems,
        refundShipping,
        refundDuties,
        orderTransactions
      );
      res.status(200).json(data);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: 'Server error while issuing refund', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
