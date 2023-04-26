import type { User, UserContextType, UserInfo } from '@/lib/playfab/types';

export const USER_INITIAL_STATE = {
  isLoggedIn: false,
  persistLogin: false,
  CustomId: undefined,
  EntityToken: undefined,
  PlayFabId: undefined,
  SessionTicket: undefined,
} as User;

export const USER_INFO_INITIAL_STATE = {
  AccountInfo: undefined,
  CharacterInventories: undefined,
  CharacterList: undefined,
  PlayerProfile: undefined,
  PlayerStatistics: undefined,
  PublisherData: undefined,
  TitleData: undefined,
  UserData: undefined,
  UserDataVersion: undefined,
  UserInventory: undefined,
  UserReadOnlyData: undefined,
  UserReadOnlyDataVersion: undefined,
  UserVirtualCurrency: undefined,
} as UserInfo;

export const USER_CONTEXT_INITIAL_STATE = {
  account: undefined,
  currencies: undefined,
  inventory: [],
  isLoggedIn: false,
  playFabId: undefined,
  profile: undefined,
  publisherData: undefined,
  stats: [],
  refetchPlayer: () => new Promise(() => undefined),
} as UserContextType;
