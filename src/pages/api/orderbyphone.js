import { POST } from "@/lib/OrderByPhone";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { phoneNumber } = await req.json(); 
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