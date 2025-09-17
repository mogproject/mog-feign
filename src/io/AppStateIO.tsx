import { DiscordUser } from '../models/detail/DiscordUser';
import invariant from 'tiny-invariant';
import AppState from '../models/AppState';
import TableSettings from '../models/detail/TableSettings';
import {
  AvatarSettings,
  defaultViewSettings,
  FeiSettings,
  StreamerSettings,
  UsernameSettings,
  ViewSettings,
} from '../models/detail/ViewSettings';
import { NamedChannel } from '../models/detail/ChannelSettings';
import FeignPlayers, { getPlayers, numberOfActivePlayers } from '../models/detail/FeignPlayers';
import { NUMBER_OF_FEI_COLORS } from '../models/app-context';
import { AppAction } from '../models/ContextProvider';
import { Dispatch } from 'react';

const KEY_VOICE_CHANNEL = 'voice_channel_url';
const KEY_NAMED_CHANNELS = 'named_channels';
const KEY_NAMED_CHANNELS_TABLE = 'named_channels_table';
const KEY_DISCORD_USERS = 'discord_users';
const KEY_DISCORD_USERS_TABLE = 'discord_users_table';
const KEY_FEIGN_PLAYERS = 'feign_players';
const KEY_VIEW_FEI = 'view_fei';
const KEY_VIEW_AVATAR = 'view_avatar';
const KEY_VIEW_USERNAME = 'view_username';
const KEY_VIEW_STREAMER = 'view_streamer';

//------------------------------------------------------------------------------
const defaultTableSettings: TableSettings = {
  sortKey: null,
  sortOrder: null,
};

const defaultAppState: AppState = {
  channelURL: '',
  namedChannels: [],
  namedChannelsTableSettings: defaultTableSettings,
  discordUsers: [],
  discordUsersTableSettings: defaultTableSettings,
  feignPlayers: { group: '', players: new Map<string, string[]>([['', Array(NUMBER_OF_FEI_COLORS).fill('')]]) },
  viewSettings: defaultViewSettings,
  isSpeaking: [],
};

//------------------------------------------------------------------------------
//    Utilities
//------------------------------------------------------------------------------
function loadFromLocalStorage<T>(key: string, loader: (obj: any) => T, defaultValue: T, isJson: boolean): T {
  try {
    const raw = localStorage.getItem(key);
    invariant(raw !== null);
    if (isJson) {
      return loader(JSON.parse(raw));
    } else {
      return loader(raw);
    }
  } catch (err) {
    console.log(key, err);
    return defaultValue;
  }
}

function loadTableSettings(obj: any, keys: string[]): TableSettings {
  try {
    invariant(keys.includes(obj.sortKey));
    invariant(obj.sortOrder === 'ASC' || obj.sortOrder === 'DESC');
    return {
      sortKey: obj.sortKey,
      sortOrder: obj.sortOrder,
    };
  } catch (err) {
    return defaultTableSettings;
  }
}

//------------------------------------------------------------------------------
//    Channel URL
//------------------------------------------------------------------------------
function loadVoiceChannelURL(obj: any): string {
  try {
    invariant(typeof obj === 'string');
    return obj as string;
  } catch (err) {
    return defaultAppState.channelURL;
  }
}

export function saveVoiceChannelURLToLocalStorage(url: string) {
  localStorage.setItem(KEY_VOICE_CHANNEL, url);
}

//------------------------------------------------------------------------------
function loadNamedChannels(obj: any): NamedChannel[] {
  try {
    invariant(Array.isArray(obj));
    return obj.map((channel: any) => {
      invariant(typeof channel.name === 'string');
      invariant(typeof channel.url === 'string');
      invariant(typeof channel.createdAt === 'number');
      return {
        name: channel.name,
        url: channel.url,
        createdAt: channel.createdAt,
      };
    });
  } catch (err) {
    return defaultAppState.namedChannels;
  }
}

export function saveNamedChannelsToLocalStorage(channels: NamedChannel[]) {
  localStorage.setItem(KEY_NAMED_CHANNELS, JSON.stringify(channels));
}

//------------------------------------------------------------------------------
function loadNamedChannelsTableSettings(obj: any): TableSettings {
  return loadTableSettings(obj, ['name', 'url', 'createdAt']);
}

export function saveNamedChannelsTableSettingsToLocalStorage(settings: TableSettings) {
  localStorage.setItem(KEY_NAMED_CHANNELS_TABLE, JSON.stringify(settings));
}

//------------------------------------------------------------------------------
//    Discord users
//------------------------------------------------------------------------------
function loadDiscordUsers(obj: any): DiscordUser[] {
  try {
    invariant(Array.isArray(obj));
    return obj.map((u) => {
      invariant(typeof u.id === 'string');
      invariant(typeof u.name === 'string');
      // v0 does not have `groups`
      const isGroupValid = Array.isArray(u.groups) && u.groups.every((g: any) => typeof g === 'string');

      return {
        id: u.id,
        name: u.name,
        groups: (isGroupValid ? u.groups : []) as string[],
      };
    });
  } catch (err) {
    return defaultAppState.discordUsers;
  }
}

export function saveDiscordUsersToLocalStorage(users: DiscordUser[]) {
  localStorage.setItem(KEY_DISCORD_USERS, JSON.stringify(users));
}

//------------------------------------------------------------------------------
function loadDiscordUsersTableSettings(obj: any): TableSettings {
  return loadTableSettings(obj, ['name', 'id', 'groups']);
}

export function saveDiscordUsersTableSettingsToLocalStorage(settings: TableSettings) {
  localStorage.setItem(KEY_DISCORD_USERS_TABLE, JSON.stringify(settings));
}

//------------------------------------------------------------------------------
//    Feign players
//------------------------------------------------------------------------------
function loadFeignPlayers(obj: any): FeignPlayers {
  try {
    if (typeof obj.group === 'string') {
      invariant(typeof obj.players === 'object');
      Object.values(obj.players).every((v) => {
        invariant(Array.isArray(v));
        invariant(v.every((s: any) => typeof s === 'string'));
        invariant(obj.length === NUMBER_OF_FEI_COLORS);
      });
      return {
        group: obj.group,
        players: new Map<string, string[]>(Object.entries(obj.players)),
      };
    } else {
      // Possibly v0
      invariant(Array.isArray(obj));
      invariant(obj.every((s: any) => typeof s === 'string'));
      invariant(obj.length === NUMBER_OF_FEI_COLORS);
      return {
        group: '',
        players: new Map<string, string[]>([['', obj]]),
      };
    }
  } catch (err) {
    return defaultAppState.feignPlayers;
  }
}
function serializeFeignPlayers(feignPlayers: FeignPlayers): Object {
  return {
    group: feignPlayers.group,
    players: Object.fromEntries(feignPlayers.players),
  };
}

export function saveFeignPlayersToLocalStorage(feignPlayers: FeignPlayers) {
  return localStorage.setItem(KEY_FEIGN_PLAYERS, JSON.stringify(serializeFeignPlayers(feignPlayers)));
}

//------------------------------------------------------------------------------
//    View settings
//------------------------------------------------------------------------------
function validateAvatarShape(obj: any) {
  invariant(typeof obj === 'number');
  invariant(0 <= obj);
  invariant(obj < 3);
}

function validateAnimationSettings(obj: any) {
  invariant(typeof obj === 'object');
  invariant(typeof obj.jump === 'boolean');
  invariant(typeof obj.flash === 'boolean');
  invariant(typeof obj.flashColor === 'string');
  invariant(typeof obj.outline === 'boolean');
  invariant(typeof obj.outlineColor === 'string');
}

function loadFeiSettings(obj: any): FeiSettings {
  try {
    invariant(typeof obj === 'object');
    invariant(typeof obj.mirror === 'boolean');
    validateAnimationSettings(obj.speaking);
    invariant(typeof obj.interval === 'number');
    return obj as FeiSettings;
  } catch (err) {
    return defaultAppState.viewSettings.fei;
  }
}

function loadAvatarSettings(obj: any): AvatarSettings {
  try {
    invariant(typeof obj === 'object');
    invariant(typeof obj.show === 'boolean');
    invariant(typeof obj.front === 'boolean');
    validateAvatarShape(obj.shape);
    validateAnimationSettings(obj.speaking);
    invariant(typeof obj.offsetY === 'number');
    return obj as AvatarSettings;
  } catch (err) {
    return defaultAppState.viewSettings.avatar;
  }
}

function loadUsernameSettings(obj: any): UsernameSettings {
  try {
    invariant(typeof obj === 'object');
    invariant(typeof obj.show === 'boolean');
    invariant(typeof obj.fontSize === 'number');
    invariant(typeof obj.fontColor === 'string');
    invariant(typeof obj.backgroundColor === 'string');
    invariant(typeof obj.offsetY === 'number');
    return obj as UsernameSettings;
  } catch (err) {
    return defaultAppState.viewSettings.username;
  }
}

function loadStreamerSettings(obj: any): StreamerSettings {
  try {
    invariant(typeof obj === 'object');
    invariant(typeof obj.showStreamerFirst === 'boolean');
    return obj as StreamerSettings;
  } catch (err) {
    return defaultAppState.viewSettings.streamer;
  }
}

export function saveFeiSettingsToLocalStorage(fei: FeiSettings) {
  localStorage.setItem(KEY_VIEW_FEI, JSON.stringify(fei));
}

export function saveAvatarSettingsToLocalStorage(s: AvatarSettings) {
  localStorage.setItem(KEY_VIEW_AVATAR, JSON.stringify(s));
}

export function saveUsernameSettingsToLocalStorage(s: UsernameSettings) {
  localStorage.setItem(KEY_VIEW_USERNAME, JSON.stringify(s));
}

export function saveStreamerSettingsToLocalStorage(s: StreamerSettings) {
  localStorage.setItem(KEY_VIEW_STREAMER, JSON.stringify(s));
}

//------------------------------------------------------------------------------
export function loadAllFromLocalStorage(): AppState {
  const feignPlayers = loadFromLocalStorage(KEY_FEIGN_PLAYERS, loadFeignPlayers, defaultAppState.feignPlayers, true);
  return {
    channelURL: loadFromLocalStorage(KEY_VOICE_CHANNEL, loadVoiceChannelURL, defaultAppState.channelURL, false),
    namedChannels: loadFromLocalStorage(KEY_NAMED_CHANNELS, loadNamedChannels, defaultAppState.namedChannels, true),
    namedChannelsTableSettings: loadFromLocalStorage(
      KEY_NAMED_CHANNELS_TABLE,
      loadNamedChannelsTableSettings,
      defaultAppState.namedChannelsTableSettings,
      true
    ),
    discordUsers: loadFromLocalStorage(KEY_DISCORD_USERS, loadDiscordUsers, defaultAppState.discordUsers, true),
    discordUsersTableSettings: loadFromLocalStorage(
      KEY_DISCORD_USERS_TABLE,
      loadDiscordUsersTableSettings,
      defaultAppState.discordUsersTableSettings,
      true
    ),
    feignPlayers: feignPlayers,
    viewSettings: new ViewSettings(
      loadFromLocalStorage(KEY_VIEW_FEI, loadFeiSettings, defaultAppState.viewSettings.fei, true),
      loadFromLocalStorage(KEY_VIEW_AVATAR, loadAvatarSettings, defaultAppState.viewSettings.avatar, true),
      loadFromLocalStorage(KEY_VIEW_USERNAME, loadUsernameSettings, defaultAppState.viewSettings.username, true),
      loadFromLocalStorage(KEY_VIEW_STREAMER, loadStreamerSettings, defaultAppState.viewSettings.streamer, true)
    ),
    isSpeaking: Array(numberOfActivePlayers(feignPlayers)).fill(false), // reset isSpeaking
  };
}

//------------------------------------------------------------------------------
export function appStateToJSON(state: AppState, anonymizeDiscordUsers: boolean, includeData: boolean, includeView: boolean) {
  var obj: Object = {};
  if (includeData) {
    if (anonymizeDiscordUsers) {
      // Create anonymous users from player IDs.
      const playerIDs: string[] = getPlayers(state.feignPlayers);
      const activeIDs: string[] = playerIDs.filter((id: string) => id !== '');
      const anonymizedUsers: DiscordUser[] = activeIDs.map((id: string, i: number) => {
        return { name: `user-${i}`, id: id, groups: [] };
      });
      obj = {
        channelURL: state.channelURL,
        namedChannels: state.namedChannels,
        namedChannelsTableSettings: state.namedChannelsTableSettings,
        discordUsers: anonymizedUsers,
        discordUsersTableSettings: defaultTableSettings,
        feignPlayers: {
          group: '',
          players: { '': playerIDs },
        },
      };
    } else {
      obj = {
        channelURL: state.channelURL,
        namedChannels: state.namedChannels,
        namedChannelsTableSettings: state.namedChannelsTableSettings,
        discordUsers: state.discordUsers,
        discordUsersTableSettings: state.discordUsersTableSettings,
        feignPlayers: serializeFeignPlayers(state.feignPlayers),
      };
    }
  }
  if (includeView) {
    obj = { ...obj, viewSettings: state.viewSettings };
  }
  return JSON.stringify(obj);
}

export function initializeAppState(dispatch: Dispatch<AppAction>) {
  dispatch(() => defaultAppState);
}

export function loadJSONString(content: string, dispatch: Dispatch<AppAction>, includeData: boolean, includeView: boolean): boolean {
  try {
    const newState: Partial<AppState> = {};
    const obj = JSON.parse(content);
    invariant(obj);

    if (includeData) {
      newState.channelURL = loadVoiceChannelURL(obj.channelURL);
      newState.namedChannels = loadNamedChannels(obj.namedChannels);
      newState.namedChannelsTableSettings = loadNamedChannelsTableSettings(obj.namedChannelsTableSettings);
      newState.discordUsers = loadDiscordUsers(obj.discordUsers);
      newState.discordUsersTableSettings = loadDiscordUsersTableSettings(obj.discordUsersTableSettings);
      newState.feignPlayers = loadFeignPlayers(obj.feignPlayers);
      newState.isSpeaking = Array(numberOfActivePlayers(newState.feignPlayers)).fill(false); // reset isSpeaking
    }
    if (includeView) {
      newState.viewSettings = new ViewSettings(
        loadFeiSettings(obj.viewSettings.fei),
        loadAvatarSettings(obj.viewSettings.avatar),
        loadUsernameSettings(obj.viewSettings.username),
        loadStreamerSettings(obj.viewSettings.streamer)
      );
    }

    // Perform update.
    dispatch((prev) => ({ ...prev, ...newState }));
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
