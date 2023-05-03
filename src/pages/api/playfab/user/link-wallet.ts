import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute } from '@/utils/session';
import { LinkWallet } from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, signature, nonce } = await req.body;
  try {
    const data = await LinkWallet({ address, signature, nonce });
    res.status(200).json(data);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withUserRoute(handler);
