import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PlayFabClient } from 'playfab-sdk';
import { getRandomKey } from '@/utils/helpers';
import {
  clearCustomID,
  getUserAuth,
  PersistCustomID,
} from '@/utils/authStorage';

type Account = PlayFabClientModels.UserAccountInfo;
type AccountResult = PlayFabClientModels.GetAccountInfoResult;
type Currencies = { [key: string]: number };
type Inventory = PlayFabClientModels.ItemInstance[];
type PlayerResult = PlayFabClientModels.GetPlayerCombinedInfoResult;
type PublisherDataResult = PlayFabClientModels.GetUserDataResult;
type PublisherData = { [key: string]: PlayFabClientModels.UserDataRecord };
type Profile = PlayFabClientModels.PlayerProfileModel;
type Stats = PlayFabClientModels.StatisticValue[];

export interface AuthSession {
  account?: Account;
  currencies?: Currencies;
  inventory?: Inventory;
  isLoggedIn: boolean;
  playFabId?: string;
  profile?: Profile;
  publisherData?: PublisherData;
  stats?: Stats;
  refetchPlayer: () => Promise<void>;
}

const UserContext = createContext<AuthSession>({
  account: undefined,
  currencies: undefined,
  inventory: [],
  isLoggedIn: false,
  playFabId: undefined,
  profile: undefined,
  publisherData: undefined,
  stats: [],
  refetchPlayer: () => new Promise(() => {}),
});

export interface Props {
  playFabClient: typeof PlayFabClient;
  [propName: string]: any;
}

const GetAccountInfoAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<AccountResult | null> => {
  return new Promise((resolve, reject) => {
    playFabClient.GetAccountInfo({}, function (error, result) {
      if (error) {
        console.error('GetAccountInfo Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
};

const GenerateCustomIDAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const CustomId = getRandomKey(100);
    const request = { CustomId, ForceLink: false };
    playFabClient.LinkCustomID(request, (error, result) => {
      if (error) {
        console.error('LinkCustomID Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('CustomID Link Success');
        resolve(CustomId);
      }
    });
  });
};

const ProfileConstraints = {
  ShowAvatarUrl: true,
  // ShowBannedUntil: true,
  // ShowCampaignAttributions: true,
  // ShowContactEmailAddresses: true,
  // ShowCreated: true,
  ShowDisplayName: true,
  // ShowExperimentVariants: true,
  // ShowLastLogin: true,
  ShowLinkedAccounts: true,
  // ShowLocations: true,
  // ShowMemberships: true,
  // ShowOrigination: true,
  // ShowPushNotificationRegistrations: true,
  // ShowStatistics: true,
  // ShowTags: true,
  // ShowTotalValueToDateInUsd: true,
  // ShowValuesToDate: true,
} as PlayFabClientModels.PlayerProfileViewConstraints;

const InfoRequestParameters = {
  GetUserAccountInfo: true,
  GetPlayerProfile: true,
  ProfileConstraints,
  GetPlayerStatistics: true,
  // PlayerStatisticNames: [],
  GetUserInventory: true,
  GetUserVirtualCurrency: true,
  GetCharacterInventories: false,
  GetCharacterList: false,
  GetTitleData: false,
  GetUserData: false,
  // UserDataKeys: ['DisplayName', 'LinkedWallets'],
  GetUserReadOnlyData: false,
  // UserReadOnlyDataKeys: []
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

const GetPlayerCombinedInfoAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<PlayerResult | null> => {
  return new Promise((resolve, reject) => {
    playFabClient.GetPlayerCombinedInfo(
      { InfoRequestParameters },
      function (error, result) {
        if (error) {
          console.error('GetPlayerCombinedInfo Error:', error.errorMessage);
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
};

async function GetDisplayName(
  playFabClient: typeof PlayFabClient
): Promise<PublisherDataResult> {
  return new Promise((resolve, reject) => {
    playFabClient.GetUserPublisherData(
      { Keys: ['DisplayName'] },
      function (error, result) {
        if (error) {
          console.error('GetUserPublisherData Error:', error.errorMessage);
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

async function GetLinkedWallets(
  playFabClient: typeof PlayFabClient
): Promise<PublisherDataResult> {
  return new Promise((resolve, reject) => {
    playFabClient.GetUserPublisherReadOnlyData(
      { Keys: ['LinkedWallets'] },
      function (error, result) {
        if (error) {
          console.error(
            'GetUserPublisherReadOnlyData Error:',
            error.errorMessage
          );
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

const GetUserPublisherDataAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<PublisherData> => {
  const { Data: PublisherData } = await GetDisplayName(playFabClient);
  const { Data: ReadOnlyData } = await GetLinkedWallets(playFabClient);
  return { ...PublisherData, ...ReadOnlyData };
};

export const UserContextProvider = (props: Props) => {
  const { playFabClient } = props;
  const [init, setInit] = useState(false);
  const [player, setPlayer] = useState<PlayerResult | null>(null);
  const [publisherData, setPublisherData] = useState<PublisherData | null>(
    null
  );
  const isLoggedIn = playFabClient?.IsClientLoggedIn();
  const { customId, persistLogin } = getUserAuth();

  const handlePlayerCombinedInfo = useCallback(async () => {
    const player = await GetPlayerCombinedInfoAsync(playFabClient);
    if (player) {
      const publisherData = await GetUserPublisherDataAsync(playFabClient);
      setPublisherData(publisherData);
      setPlayer(player);
      setInit(true);
    }
  }, [playFabClient]);

  const handleAccountInfo = useCallback(async () => {
    // Call GetAccountInfo API to retrieve player account details
    const account = await GetAccountInfoAsync(playFabClient);
    if (account) {
      let anonymousId = account.AccountInfo?.CustomIdInfo?.CustomId;
      // Generate & link a CustomID if not available
      if (!anonymousId)
        anonymousId = await GenerateCustomIDAsync(playFabClient);
      // Store CustomID to persist login
      if (anonymousId && persistLogin) PersistCustomID(anonymousId);
      void handlePlayerCombinedInfo();
    }
  }, [playFabClient, persistLogin, handlePlayerCombinedInfo]);

  const handleAnonLogin = useCallback(
    async (CustomId: string) => {
      // Login player with stored CustomID
      if (!init) {
        const request = { CreateAccount: false, CustomId };
        playFabClient.LoginWithCustomID(request, (error, result) => {
          if (error) {
            console.error('LoginWithCustomID Error:', error.errorMessage);
            switch (error.code) {
              case 400: // AccountDeleted
              case 404: // AccountNotFound
                clearCustomID();
                break;
              default:
                break;
            }
            setPlayer(null);
          } else {
            void handlePlayerCombinedInfo();
          }
        });
      }
    },
    [handlePlayerCombinedInfo, init, playFabClient]
  );

  useEffect(() => {
    if (isLoggedIn) {
      void handleAccountInfo();
    } else if (customId && persistLogin) {
      void handleAnonLogin(customId);
    } else {
      setPlayer(null);
    }
  }, [customId, isLoggedIn, persistLogin, handleAccountInfo, handleAnonLogin]);

  const refetchPlayer = useCallback(
    async () => await handlePlayerCombinedInfo(),
    [handlePlayerCombinedInfo]
  );
  const { InfoResultPayload, PlayFabId } = player || {};
  const value = useMemo(
    () => ({
      account: InfoResultPayload?.AccountInfo,
      currencies: InfoResultPayload?.UserVirtualCurrency,
      inventory: InfoResultPayload?.UserInventory,
      isLoggedIn: isLoggedIn,
      playFabId: PlayFabId,
      profile: InfoResultPayload?.PlayerProfile,
      stats: InfoResultPayload?.PlayerStatistics,
      publisherData: publisherData ?? undefined,
      refetchPlayer,
    }),
    [InfoResultPayload, isLoggedIn, PlayFabId, publisherData, refetchPlayer]
  );

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
