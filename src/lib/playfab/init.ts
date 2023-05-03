import {
  PlayFab,
  PlayFabAdmin,
  PlayFabClient,
  PlayFabCloudScript,
} from 'playfab-sdk';

const createClient = (titleId: string, developerSecretKey: string) => {
  PlayFab.settings.titleId = titleId;
  PlayFab.settings.developerSecretKey = developerSecretKey;

  return { PlayFabAdmin, PlayFabClient, PlayFabCloudScript };
};

export const playfab = createClient(
  process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID as string,
  process.env.PLAYFAB_API_KEY as string
);

export default playfab;
