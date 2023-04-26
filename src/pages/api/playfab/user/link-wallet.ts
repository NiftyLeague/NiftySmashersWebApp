import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import { LinkWallet } from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, signature, nonce } = await req.body;
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  try {
    const data = await LinkWallet({ address, signature, nonce });
    res.status(200).json(data);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
