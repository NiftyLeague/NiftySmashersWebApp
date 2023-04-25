export type PlayFabClient = PlayFabClientModule.IPlayFabClient;

export type LoginResult = PlayFabClientModels.LoginResult;
export type RegisterUserResult = PlayFabClientModels.RegisterPlayFabUserResult;

export type LinkGoogleResult = PlayFabClientModels.LinkGoogleAccountResult;
export type LinkFacebookResult = PlayFabClientModels.LinkFacebookAccountResult;
export type LinkProviderResult = LinkGoogleResult | LinkFacebookResult | null;

export type Account = PlayFabClientModels.UserAccountInfo;
export type AccountResult = PlayFabClientModels.GetAccountInfoResult;
export type Currencies = { [key: string]: number };
export type Inventory = PlayFabClientModels.ItemInstance[];
export type PlayerResult = PlayFabClientModels.GetPlayerCombinedInfoResult;
export type PublisherDataResult = PlayFabClientModels.GetUserDataResult;
export type PublisherData = {
  [key: string]: PlayFabClientModels.UserDataRecord;
};
export type Profile = PlayFabClientModels.PlayerProfileModel;
export type Stats = PlayFabClientModels.StatisticValue[];

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
