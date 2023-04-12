import { PlayFab, PlayFabClient } from 'playfab-sdk';

const createClient = (titleId: string, developerSecretKey: string) => {
  PlayFab.settings.titleId = titleId;
  PlayFab.settings.developerSecretKey = developerSecretKey;

  return PlayFabClient;
};

export const playfab = createClient(
  process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID as string,
  process.env.NEXT_PUBLIC_PLAYFAB_API_KEY as string
);
