import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/playfab/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export type Event = {
  data: {};
};
export type Events = Event[];

async function eventsRoute(req: NextApiRequest, res: NextApiResponse<Events>) {
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  try {
    const events = [{ data: {} }];
    // const { data: events } =
    //   await octokit.rest.activity.listPublicEventsForUser({
    //     username: user.login,
    //   });

    res.json(events);
  } catch (error) {
    res.status(200).json([]);
  }
}

export default withIronSessionApiRoute(eventsRoute, sessionOptions);
