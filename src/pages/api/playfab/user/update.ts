import { NextApiRequest, NextApiResponse } from 'next';
import { withUserRoute } from '@/utils/session';
import {
  AddOrUpdateContactEmail,
  ChangeDisplayName,
  UpdateAvatarUrl,
} from '@/lib/playfab/api';
import { errorResHandler } from '@/utils/errorHandlers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, displayName, avatar_url } = await req.body;
  try {
    // Update Account Display Name
    if (displayName) await ChangeDisplayName(displayName);
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

export default withUserRoute(handler);
