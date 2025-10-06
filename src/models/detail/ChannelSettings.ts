const CHANNEL_URL_PATTERN = /^https:[/][/]discord.com[/]channels[/](\d+)[/](\d+)[/]?$/;

export interface NamedChannel {
  name: string;
  url: string;
  createdAt: number; // seconds since epoch
}

export function retrieveChannelIDs(voiceChannelURL: string): [string, string] {
  const result = voiceChannelURL.match(CHANNEL_URL_PATTERN);
  return result ? [result[1], result[2]] : ['', ''];
}

export function isValidVoiceChannelURL(voiceChannelURL: string): boolean {
  return CHANNEL_URL_PATTERN.test(voiceChannelURL);
}

export function createUrl(serverId: string, channelId: string, showStreamerFirst: boolean) {
  let url = new URL(`https://streamkit.discord.com/overlay/voice/${serverId}/${channelId}`);
  if (showStreamerFirst) url.searchParams.append('streamer_avatar_first', 'true');
  return url.toString();
}
