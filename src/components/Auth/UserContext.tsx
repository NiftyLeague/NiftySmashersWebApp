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
type Profile = PlayFabClientModels.PlayerProfileModel;
type Stats = PlayFabClientModels.StatisticValue[];

export interface AuthSession {
  account?: Account;
  currencies?: Currencies;
  inventory?: Inventory;
  isLoggedIn: boolean;
  playFabId?: string;
  profile?: Profile;
  stats?: Stats;
}

const UserContext = createContext<AuthSession>({
  account: undefined,
  currencies: undefined,
  inventory: [],
  isLoggedIn: false,
  playFabId: undefined,
  profile: undefined,
  stats: [],
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

const GetPlayerCombinedInfoAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<PlayerResult | null> => {
  return new Promise((resolve, reject) => {
    const request = {
      InfoRequestParameters: {
        GetCharacterInventories: false,
        GetCharacterList: false,
        GetPlayerProfile: true,
        GetPlayerStatistics: true,
        GetTitleData: false,
        GetUserAccountInfo: true,
        GetUserData: false,
        GetUserInventory: true,
        GetUserPublisherData: false,
        GetUserReadOnlyData: false,
        GetUserTitleData: false,
        GetUserVirtualCurrency: true,
      },
    };
    playFabClient.GetPlayerCombinedInfo(
      request as unknown as PlayFabClientModels.GetPlayerCombinedInfoRequest,
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

export const UserContextProvider = (props: Props) => {
  const { playFabClient } = props;
  const [init, setInit] = useState(false);
  const [player, setPlayer] = useState<PlayerResult | null>(null);
  const isLoggedIn = playFabClient?.IsClientLoggedIn();
  const { customId, persistLogin } = getUserAuth();

  const handlePlayerCombinedInfo = useCallback(async () => {
    const player = await GetPlayerCombinedInfoAsync(playFabClient);
    if (player) {
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
    }),
    [InfoResultPayload, isLoggedIn, PlayFabId]
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
