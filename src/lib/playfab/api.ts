import { Provider } from '@supabase/supabase-js';
import { playfab } from '@/lib/playfab/init';
import {
  authStorage,
  getRandomKey,
  isEthereumSignatureValid,
  parseLinkedWalletResult,
} from '@/lib/playfab/utils';
import {
  AccountResult,
  LinkFacebookResult,
  LinkGoogleResult,
  LinkProviderResult,
  LoginResult,
  PlayerResult,
  PublisherData,
  PublisherDataResult,
  RegisterUserResult,
} from '@/lib/playfab/types';

const { PlayFabClient, PlayFabCloudScript } = playfab;

/*************************************** Login / Sign Up **********************************************/

export const RegisterPlayFabUser = async (params: {
  Email: string;
  Password: string;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<RegisterUserResult>> => {
  const request = {
    ...params,
    Username: getRandomKey(20),
    RequireBothUsernameAndEmail: true,
  };
  return new Promise((resolve, reject) => {
    PlayFabClient.RegisterPlayFabUser(request, (error, result) => {
      if (error) {
        console.error('RegisterPlayFabUser Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const LoginWithEmailAddress = async (params: {
  Email: string;
  Password: string;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<LoginResult>> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.LoginWithEmailAddress({ ...params }, (error, result) => {
      if (error) {
        console.error('LoginWithEmailAddress Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const LoginWithCustomIDAsync = async (params: {
  CustomId: string;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<LoginResult>> => {
  return new Promise((resolve, reject) => {
    const request = { ...params, CreateAccount: false };
    PlayFabClient.LoginWithCustomID(request, (error, result) => {
      if (error) {
        console.error('LoginWithCustomID Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('CustomID Link Success');
        resolve(result);
      }
    });
  });
};

export const GenerateCustomIDAsync = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const CustomId = getRandomKey(100);
    const request = { CustomId, ForceLink: false };
    PlayFabClient.LinkCustomID(request, (error, result) => {
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

export const SendAccountRecoveryEmail = async (params: {
  Email: string;
}): Promise<
  PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.SendAccountRecoveryEmailResult>
> => {
  return new Promise((resolve, reject) => {
    const request = { TitleId: PlayFabClient.settings.titleId, ...params };
    PlayFabClient.SendAccountRecoveryEmail(request, (error, result) => {
      if (error) {
        console.error('SendAccountRecoveryEmail Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export function logout() {
  PlayFabClient.ForgetAllCredentials();
  authStorage.clearCustomID();
}

/*************************************** Linked Providers **********************************************/

async function linkGoogleAccount(): Promise<LinkGoogleResult | null> {
  const ServerAuthCode = null;
  if (ServerAuthCode) {
    return new Promise((resolve, reject) => {
      PlayFabClient.LinkGoogleAccount(
        { ForceLink: true, ServerAuthCode },
        function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result.data);
          }
        }
      );
    });
  }
  return null;
}

async function linkFacebookAccount(): Promise<LinkFacebookResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.GetUserPublisherReadOnlyData(
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

export const linkProvider = async (
  provider: Provider
): Promise<{ error?: unknown; result?: LinkProviderResult }> => {
  try {
    let result: LinkProviderResult = null;
    switch (provider) {
      case 'google':
        result = await linkGoogleAccount();
      case 'facebook':
        result = await linkFacebookAccount();
      default:
        break;
    }
    return { result };
  } catch (error) {
    return { error };
  }
};

/*************************************** GET Account Info **********************************************/

export const GetAccountInfoAsync = async (): Promise<AccountResult | null> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.GetAccountInfo({}, (error, result) => {
      if (error) {
        console.error('GetAccountInfo Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
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

export const GetPlayerCombinedInfoAsync =
  async (): Promise<PlayerResult | null> => {
    return new Promise((resolve, reject) => {
      const request = { InfoRequestParameters };
      PlayFabClient.GetPlayerCombinedInfo(request, (error, result) => {
        if (error) {
          console.error('GetPlayerCombinedInfo Error:', error.errorMessage);
          reject(error);
        } else {
          resolve(result.data);
        }
      });
    });
  };

export async function GetDisplayName(): Promise<PublisherDataResult> {
  return new Promise((resolve, reject) => {
    const request = { Keys: ['DisplayName'] };
    PlayFabClient.GetUserPublisherData(request, (error, result) => {
      if (error) {
        console.error('GetUserPublisherData Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
}

export async function GetLinkedWallets(): Promise<PublisherDataResult> {
  return new Promise((resolve, reject) => {
    const request = { Keys: ['LinkedWallets'] };
    PlayFabClient.GetUserPublisherReadOnlyData(request, (error, result) => {
      if (error) {
        console.error(
          'GetUserPublisherReadOnlyData Error:',
          error.errorMessage
        );
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
}

export const GetUserPublisherDataAsync = async (): Promise<PublisherData> => {
  const { Data: PublisherData } = await GetDisplayName();
  const { Data: ReadOnlyData } = await GetLinkedWallets();
  return { ...PublisherData, ...ReadOnlyData };
};

/*************************************** UPDATE Account Info **********************************************/

export async function AddOrUpdateContactEmail(
  EmailAddress: string
): Promise<PlayFabClientModels.AddOrUpdateContactEmailResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.AddOrUpdateContactEmail({ EmailAddress }, (error, result) => {
      if (error) {
        console.error('AddOrUpdateContactEmail Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('AddOrUpdateContactEmail Success');
        resolve(result);
      }
    });
  });
}

export async function UpdateAvatarUrl(
  ImageUrl: string
): Promise<PlayFabClientModels.EmptyResponse> {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateAvatarUrl({ ImageUrl }, (error, result) => {
      if (error) {
        console.error('UpdateAvatarUrl Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('UpdateAvatarUrl Success');
        resolve(result);
      }
    });
  });
}

export async function UpdateUserPublisherData(
  request: PlayFabClientModels.UpdateUserDataRequest
): Promise<PlayFabClientModels.UpdateUserDataResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateUserPublisherData(request, (error, result) => {
      if (error) {
        console.error('UpdateUserPublisherData Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('UpdateUserPublisherData Success');
        resolve(result.data);
      }
    });
  });
}

/*************************************** PlayFabCloudScript **********************************************/

type LinkWalletParams = {
  chain?: string;
  address: string;
  signature: string;
  nonce: string;
};

export async function LinkWallet({
  chain = 'ethereum',
  address,
  signature,
  nonce,
}: LinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  let linkedWallets: string[] = [];
  const { Data } = await GetLinkedWallets();
  if (Data) linkedWallets = parseLinkedWalletResult(Data);

  return new Promise((resolve, reject) => {
    let error = null;
    if (chain != 'ethereum')
      error = new Error('Only Ethereum wallets are supported at this time');

    if (!isEthereumSignatureValid(address, signature, nonce))
      error = new Error('Failed to validate signature');

    const walletEntry = `${chain}:${address}`.toLowerCase();
    if (linkedWallets.includes(walletEntry))
      error = new Error(
        `${address.substring(
          0,
          6
        )}... address is already linked to this account`
      );

    if (error) {
      reject(error);
      return;
    }

    const FunctionName = 'Accounts_LinkWallet';
    const FunctionParameter = {
      Chain: chain,
      Address: address.toLowerCase(),
      Signature: signature,
      Nonce: nonce,
    };

    PlayFabCloudScript.ExecuteFunction(
      { FunctionName, FunctionParameter },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

type UnlinkWalletParams = { chain?: string; address: string };

export async function UnlinkWallet({
  chain = 'ethereum',
  address,
}: UnlinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  let linkedWallets: string[] = [];
  const { Data } = await GetLinkedWallets();
  if (Data) linkedWallets = parseLinkedWalletResult(Data);

  return new Promise((resolve, reject) => {
    let error = null;
    if (chain != 'ethereum')
      error = new Error('Only Ethereum wallets are supported at this time');

    const walletEntry = `${chain}:${address}`.toLowerCase();
    if (!linkedWallets.includes(walletEntry))
      error = new Error(
        `${address.substring(0, 6)}... address is not linked to this account`
      );

    if (error) {
      reject(error);
      return;
    }

    const FunctionName = 'Accounts_UnlinkWallet';
    const FunctionParameter = {
      Chain: chain,
      Address: address.toLowerCase(),
    };

    PlayFabCloudScript.ExecuteFunction(
      { FunctionName, FunctionParameter },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}
