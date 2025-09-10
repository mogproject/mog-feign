export default interface FeignPlayers {
  /** Current user group ("" by default). */
  group: string;

  /** Mapping from groups to players' Discord IDs. */
  players: Map<string, string[]>;
}
