import React from 'react';
import invariant from 'tiny-invariant';
import {
  loadAllFromLocalStorage,
  saveAvatarSettingsToLocalStorage,
  saveDiscordUsersTableSettingsToLocalStorage,
  saveDiscordUsersToLocalStorage,
  saveFeignPlayersToLocalStorage,
  saveFeiSettingsToLocalStorage,
  saveNamedChannelsTableSettingsToLocalStorage,
  saveNamedChannelsToLocalStorage,
  saveStreamerSettingsToLocalStorage,
  saveUsernameSettingsToLocalStorage,
  saveVoiceChannelURLToLocalStorage,
} from '../io/AppStateIO';
import { NUMBER_OF_FEI_COLORS } from './app-context';
import AppState from './AppState';
import { DiscordUser } from './detail/DiscordUser';

// Utilities.
function findUserGroups(users: DiscordUser[]) {
  return Array.from(new Set(users.flatMap((u) => u.groups))).sort();
}

// Action.
export type AppAction = (prev: AppState) => AppState;

// Context.
const StateContext = React.createContext<AppState | undefined>(undefined);
const DispatchContext = React.createContext<React.Dispatch<AppAction> | undefined>(undefined);

// Custom hooks.
export function useAppState(): AppState {
  const context = React.useContext(StateContext);
  invariant(context);
  return context;
}

export function useUserGroups() {
  const { discordUsers } = useAppState();
  const groups = React.useMemo(() => findUserGroups(discordUsers), [discordUsers]);
  return groups;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const context = React.useContext(DispatchContext);
  invariant(context);
  return context;
}

// Reducer.
function appReducer(state: AppState, action: AppAction): AppState {
  return action(state);
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  // Load from local storage.
  const initialState = loadAllFromLocalStorage();
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  // Effects; save to local storage.
  React.useEffect(() => {
    saveVoiceChannelURLToLocalStorage(state.channelURL);
  }, [state.channelURL]);

  React.useEffect(() => {
    saveNamedChannelsToLocalStorage(state.namedChannels);
  }, [state.namedChannels]);

  React.useEffect(() => {
    saveNamedChannelsTableSettingsToLocalStorage(state.namedChannelsTableSettings);
  }, [state.namedChannelsTableSettings]);

  React.useEffect(() => {
    saveDiscordUsersToLocalStorage(state.discordUsers);
    const groups = findUserGroups(state.discordUsers);

    // Clean feign players
    dispatch((prev) => {
      const newGroup = groups.includes(prev.feignPlayers.group) ? prev.feignPlayers.group : '';
      const newPlayers = new Map<string, string[]>(
        Array.from(prev.feignPlayers.players).flatMap(([k, v]) => {
          if (k !== '' && !groups.includes(k)) {
            return []; // group no longer exists
          } else {
            // Make sure that each player exists and belongs to the specific group.
            return [
              [
                k,
                v.map((id) => {
                  if (id === '') {
                    return ''; // unselected
                  }

                  const user = state.discordUsers.find((user) => user.id === id && (k === '' || user.groups.includes(k)));
                  return user === undefined ? '' : id;
                }),
              ],
            ];
          }
        })
      );
      groups.forEach((group) => {
        if (!newPlayers.has(group)) {
          newPlayers.set(group, Array(NUMBER_OF_FEI_COLORS).fill(''));
        }
      });
      return { ...prev, feignPlayers: { group: newGroup, players: newPlayers } };
    });
  }, [state.discordUsers]);

  React.useEffect(() => {
    saveDiscordUsersTableSettingsToLocalStorage(state.discordUsersTableSettings);
  }, [state.discordUsersTableSettings]);

  React.useEffect(() => {
    saveFeignPlayersToLocalStorage(state.feignPlayers);
  }, [state.feignPlayers]);

  React.useEffect(() => {
    saveFeiSettingsToLocalStorage(state.viewSettings.fei);
  }, [state.viewSettings.fei]);

  React.useEffect(() => {
    saveAvatarSettingsToLocalStorage(state.viewSettings.avatar);
  }, [state.viewSettings.avatar]);

  React.useEffect(() => {
    saveUsernameSettingsToLocalStorage(state.viewSettings.username);
  }, [state.viewSettings.username]);

  React.useEffect(() => {
    saveStreamerSettingsToLocalStorage(state.viewSettings.streamer);
  }, [state.viewSettings.streamer]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
