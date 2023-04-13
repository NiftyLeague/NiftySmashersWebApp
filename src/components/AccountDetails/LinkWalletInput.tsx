import { useState } from 'react';
import { Button, IconLink2, Input } from '@supabase/ui';
import { LinkWallet, signMessage } from '@/utils/wallet';

export default function LinkWalletInput({
  index,
  address,
}: {
  index: number;
  address?: string;
}) {
  const [error, setError] = useState<string | undefined>();

  const handleLinkWallet = async () => {
    setError(undefined);
    const result = await signMessage();
    if (result) {
      const { address, nonce, signature } = result;
      try {
        await LinkWallet({ address, signature, nonce });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          console.error(`Unknown error: ${e}`);
        }
      }
    }
  };

  // const handleUnLinkWallet = async () => {}

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
              // <Button danger key="remove" onClick={handleUnLinkWallet}>
              //   Remove
              // </Button>,
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
