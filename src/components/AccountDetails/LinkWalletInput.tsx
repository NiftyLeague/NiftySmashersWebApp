import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, IconLink2, Input } from '@supabase/ui';
import { errorMsgHandler } from '@/utils/errorHandlers';
import { fetchJson } from '@/lib/playfab/utils';
import { Auth } from '@/lib/playfab/components';
import { signMessage } from '@/utils/wallet';

export default function LinkWalletInput({
  index,
  address,
}: {
  index: number;
  address?: string;
}) {
  const [error, setError] = useState<string | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { refetchPlayer } = Auth.useUserContext();

  const handleLinkWallet = async () => {
    setError(undefined);
    const result = await signMessage();
    if (result) {
      const { address, nonce, signature } = result;
      try {
        await fetchJson('/api/playfab/user/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature, nonce }),
        });
        await refetchPlayer();
        enqueueSnackbar('Wallet link success!', { variant: 'success' });
      } catch (e) {
        const msg = errorMsgHandler(e);
        if (e instanceof Error) {
          setError(msg);
        } else {
          enqueueSnackbar(`Unknown error: ${e}`, { variant: 'error' });
        }
      }
    }
  };

  const handleUnLinkWallet = async () => {
    setError(undefined);
    setDeleteLoading(true);
    if (address) {
      try {
        const [chain, wallet] = address.split(':');
        await fetchJson('/api/playfab/user/unlink-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet, chain }),
        });
        await refetchPlayer();
        enqueueSnackbar('Unlink wallet link success!', { variant: 'success' });
      } catch (e) {
        const msg = errorMsgHandler(e);
        if (e instanceof Error) {
          setError(msg);
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }
    }
    setDeleteLoading(false);
  };

  const linked = Boolean(address && address.length > 1);

  return (
    <Input
      key={index}
      copy={linked}
      disabled
      error={error}
      value={address}
      actions={
        linked
          ? [
              <Button
                danger
                key="remove"
                onClick={handleUnLinkWallet}
                loading={deleteLoading}
                style={{ opacity: 1 }}
              >
                Remove
              </Button>,
            ]
          : [
              <Button
                type="dashed"
                icon={<IconLink2 />}
                key="connect"
                onClick={handleLinkWallet}
              >
                Connect Wallet
              </Button>,
            ]
      }
    />
  );
}
