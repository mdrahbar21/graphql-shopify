import { getOrdersByPhone } from "@/internalServerFunctions/OrderByPhone";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { phoneNumber } = req.body;
  const result = await getOrdersByPhone(phoneNumber);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json(result);
}
