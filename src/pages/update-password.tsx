import { Auth, Card, Space } from '@supabase/ui';
import { supabase } from '@/utils/initSupabase';

const UpdatePassword = ({ user }: any) => {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '420px',
        height: '100vh',
        margin: 'auto',
      }}
    >
      {user && (
        <Card style={{ margin: 'auto', textAlign: 'center' }}>
          <Space direction="vertical" size={6}>
            <Auth.UpdatePassword supabaseClient={supabase} />
          </Space>
        </Card>
      )}
    </div>
  );
};

export async function getServerSideProps({ req }: { req: Request }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } };
  }

  // If there is a user, return it.
  return { props: { user } };
}

export default UpdatePassword;
