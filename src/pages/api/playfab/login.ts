import { NextApiRequest, NextApiResponse } from 'next';
import { LoginWithEmailAddress, LoginWithCustomID } from '@/lib/playfab/api';
import { withSessionRoute } from '@/utils/session';
import { errorResHandler } from '@/utils/errorHandlers';
import type { User } from '@/lib/playfab/types';
import { playfab } from '@/lib/playfab';

const { PlayFabClient } = playfab;

const InfoRequestParameters = {
  GetUserAccountInfo: true,
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, rememberMe, CustomId } = await req.body;
  const isLoggedIn = PlayFabClient?.IsClientLoggedIn();
  if (!isLoggedIn) {
    try {
      let loginRes;
      if (CustomId) {
        loginRes = await LoginWithCustomID({ CustomId });
      } else {
        loginRes = await LoginWithEmailAddress({
          Email: email,
          Password: password,
          InfoRequestParameters,
        });
      }
      const { EntityToken, SessionTicket, PlayFabId, InfoResultPayload } =
        loginRes.data;
      const user = {
        isLoggedIn: true,
        persistLogin: rememberMe ?? req.session.user?.persistLogin,
        EntityToken,
        PlayFabId,
        SessionTicket,
        CustomId:
          CustomId ?? InfoResultPayload?.AccountInfo?.CustomIdInfo?.CustomId,
      } as User;
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } catch (error) {
      const { status, message } = errorResHandler(error);
      res.status(status).json({ message });
    }
  } else {
    res.status(429).json({ message: 'User already logged in.' });
  }
}

export default withSessionRoute(handler);
