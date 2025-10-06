import { NamedChannel } from './detail/ChannelSettings';
import { DiscordUser } from './detail/DiscordUser';
import FeignPlayers from './detail/FeignPlayers';
import TableSettings from './detail/TableSettings';
import { ViewSettings } from './detail/ViewSettings';

// App state.
interface AppState {
  // Channel URL
  channelURL: string;

  // Named channels [since v1.0.0]
  namedChannels: NamedChannel[];

  // Named channels table [since v1.0.0]
  namedChannelsTableSettings: TableSettings;

  // Discord users [updated v.1.0.0]
  discordUsers: DiscordUser[];

  // Discord users table
  discordUsersTableSettings: TableSettings;

  // Feign players [updated v1.0.0]
  feignPlayers: FeignPlayers;

  // View settings
  viewSettings: ViewSettings;

  // Preview speaking
  isSpeaking: boolean[];
}

export default AppState;
