export interface DiscordUser {
  id: string;
  name: string;
  groups: string[]; // [Since v1.0.0] list of groups
}
