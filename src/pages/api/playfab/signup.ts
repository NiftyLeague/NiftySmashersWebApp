import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterPlayFabUser, GenerateCustomIDAsync } from '@/lib/playfab/api';
import { withSessionRoute } from '@/utils/session';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, rememberMe } = await req.body;
  try {
    const params = { Email: email, Password: password };
    const loginRes = await RegisterPlayFabUser(params);
    const { EntityToken, SessionTicket, PlayFabId } = loginRes.data;
    // Generate & link a CustomID for new PlayFab user
    const CustomId = await GenerateCustomIDAsync();
    const user = {
      isLoggedIn: true,
      persistLogin: rememberMe,
      CustomId,
      EntityToken,
      PlayFabId,
      SessionTicket,
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
