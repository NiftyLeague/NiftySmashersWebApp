import Image from 'next/image';
import { Card, Typography, Space } from '@supabase/ui';
import { withSessionSsr } from '@/utils/session';
import Auth from '@/lib/playfab/components/Auth';
import BackButton from '@/components/BackButton';
import useProviders from '@/hooks/useProviders';
import useFlags from '@/hooks/useFlags';

const Login = () => {
  const providers = useProviders();
  const { enableLinkProviders } = useFlags();
  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          maxWidth: '450px',
          height: '100vh',
          margin: 'auto',
        }}
      >
        <Card style={{ margin: 'auto' }}>
          <Space direction="vertical" size={8}>
            <div>
              <Image
                src="/logo/white.png"
                alt="Company Logo"
                width={50}
                height={50}
              />
              <Typography.Title level={3} style={{ marginTop: 16 }}>
                Welcome to Nifty League
              </Typography.Title>
            </div>
            <Auth
              providers={enableLinkProviders ? providers : undefined}
              view="sign_in"
              socialLayout="horizontal"
              socialButtonSize="xlarge"
              redirectTo="/profile"
            />
          </Space>
        </Card>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const user = req.session.user;
  // redirect to profile if already logged in
  if (user && user.isLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/profile', permanent: false },
    };
  }
  return { props: {} };
});

export default Login;
