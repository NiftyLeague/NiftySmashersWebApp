import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/utils/session';
import {
  AddOrUpdateContactEmail,
  UpdateUserPublisherData,
  UpdateAvatarUrl,
} from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, displayName, avatar_url } = await req.body;
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  try {
    // Update Account Display Name
    if (displayName) {
      const request = {
        Data: { DisplayName: displayName },
        Permission: 'public',
      };
      await UpdateUserPublisherData(request);
    }
    // Update Profile Contact Email
    if (email) await AddOrUpdateContactEmail(email);
    // Update Profile Avatar
    if (avatar_url) await UpdateAvatarUrl(avatar_url);

    res.status(200).json({});
  } catch (error) {
    const { status, message } = errorResHandler(error);
    res.status(status).json({ message });
  }
}

export default withSessionRoute(handler);
