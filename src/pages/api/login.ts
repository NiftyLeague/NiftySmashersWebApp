import type { User } from './user';

// import { Octokit } from 'octokit';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/playfab/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { playfab } from '@/lib/playfab/init';
// const octokit = new Octokit();

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username } = await req.body;

  try {
    // const {
    //   data: { login, avatar_url },
    // } = await octokit.rest.users.getByUsername({ username });

    const user = { isLoggedIn: true } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
