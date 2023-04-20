import { useRouter } from 'next/router';
import cn from 'classnames';
import { IconLogOut } from '@supabase/ui';
import { playfab } from '@/utils/initPlayfab';
import { clearCustomID } from '@/utils/authStorage';

import styles from '@/styles/profile.module.css';

function logout() {
  playfab.ForgetAllCredentials();
  clearCustomID();
}

export default function LogoutButton({ loading = false }) {
  const router = useRouter();
  return (
    <div>
      <button
        className={cn(styles.button, 'block')}
        style={{ marginBottom: 0 }}
        disabled={loading}
        onClick={() => {
          logout();
          setTimeout(() => router.push('/login'), 1000);
        }}
      >
        <IconLogOut />
        Sign Out
      </button>
    </div>
  );
}
