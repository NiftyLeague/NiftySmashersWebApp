import { supabase } from '@/utils/initSupabase';
import { Card, Space } from '@supabase/ui';
import BackButton from '@/components/BackButton';
import Auth from '@/components/Auth';

const UpdatePassword = ({ user }: any) => {
  return (
    <>
      <BackButton />
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
    </>
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