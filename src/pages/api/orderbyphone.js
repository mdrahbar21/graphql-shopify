import { POST } from "@/lib/OrderByPhone";

export default async function handler(req, res) {

  const { phoneNumber } = req.body;
  const result = await POST(phoneNumber);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json(result);
}
