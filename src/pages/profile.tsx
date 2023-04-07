import Link from 'next/link';
import { Card, Typography, Space } from '@supabase/ui';
import { supabase } from '@/utils/initSupabase';

export default function Profile({ user }: any) {
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      <Card>
        <Space direction="vertical" size={6}>
          <Typography.Text>You&apos;re signed in</Typography.Text>
          <Typography.Text strong>Email: {user.email}</Typography.Text>
          <Typography.Text type="success">
            User data retrieved server-side (from Cookie in getServerSideProps):
          </Typography.Text>

          <Typography.Text>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </Typography.Text>

          <Typography.Text>
            <Link href="/">Static example with useSWR</Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
}

export async function getServerSideProps({ req }: { req: Request }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    // If no user, redirect to login.
    return { props: {}, redirect: { destination: '/login', permanent: false } };
  }

  // If there is a user, return it.
  return { props: { user } };
}
