import { NextApiRequest, NextApiResponse } from 'next';
import { SendAccountRecoveryEmail } from '@/lib/playfab/api';
import { withSessionRoute } from '@/utils/session';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = await req.body;
  const { SessionTicket } = req.session.user as User;
  if (SessionTicket) {
    try {
      const data = await SendAccountRecoveryEmail(email, SessionTicket);
      res.status(200).json(data);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      res.status(status).json({ message });
    }
  }
}

export default withSessionRoute(handler);
