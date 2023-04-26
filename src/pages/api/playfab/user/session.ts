import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import { USER_INITIAL_STATE } from '@/lib/playfab/constants';
import type { User } from '@/lib/playfab/types';
import { playfab } from '@/lib/playfab';

const { PlayFabClient } = playfab;

async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  const isLoggedIn = PlayFabClient?.IsClientLoggedIn();
  if (req.session.user) {
    req.session.user.isLoggedIn = isLoggedIn;
    await req.session.save();
    res.json({
      ...req.session.user,
      isLoggedIn,
    });
  } else {
    res.json(USER_INITIAL_STATE);
  }
}

export default withSessionRoute(handler);
