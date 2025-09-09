import React, { ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { SortOrderType } from '../components/forms/rankable-table/types';
import { DiscordUser } from './DiscordUser';

// Utilities.
function findUserGroups(users: DiscordUser[]) {
  return Array.from(new Set(users.flatMap((u) => u.groups))).sort();
}

export interface DiscordUserTableSettings {
  sortKey: string | null;
  sortOrder: SortOrderType | null;
}

// App state.
export interface AppState {
  // Discord users
  discordUsers: DiscordUser[];

  // Discord users table
  discordUsersTableSettings: DiscordUserTableSettings;
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

export function ContextProvider({ children }: { children: ReactNode }) {
  // Load from local storage
  const initDiscordUsers = JSON.parse(localStorage.getItem('discord_users') || '[]');
  const initDiscordUsersTableSettings = JSON.parse(localStorage.getItem('discord_users_table') || '{"sortKey":null,"sortOrder":null}');
  const defaultState: AppState = {
    discordUsers: initDiscordUsers,
    discordUsersTableSettings: initDiscordUsersTableSettings,
  };

  const [state, dispatch] = React.useReducer(appReducer, defaultState);

  // Effects.
  React.useEffect(() => {
    localStorage.setItem('discord_users', JSON.stringify(state.discordUsers));
  }, [state.discordUsers]);

  React.useEffect(() => {
    localStorage.setItem('discord_users_table', JSON.stringify(state.discordUsersTableSettings));
  }, [state.discordUsersTableSettings]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
