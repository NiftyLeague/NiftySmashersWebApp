import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import { GetPlayerCombinedInfo, GetUserPublisherData } from '@/lib/playfab/api';
import { USER_INFO_INITIAL_STATE } from '@/lib/playfab/constants';
import type { UserInfo } from '@/lib/playfab/types';

async function handler(req: NextApiRequest, res: NextApiResponse<UserInfo>) {
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  try {
    const player = await GetPlayerCombinedInfo();
    const publisherData = await GetUserPublisherData();

    res.json({
      ...USER_INFO_INITIAL_STATE,
      ...(player ? player.InfoResultPayload : {}),
      PublisherData: publisherData,
    });
  } catch (error) {
    res.status(200).json(USER_INFO_INITIAL_STATE);
  }
}

export default withSessionRoute(handler);
