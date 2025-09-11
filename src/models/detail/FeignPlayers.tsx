import { NUMBER_OF_FEI_COLORS } from '../app-context';

export default interface FeignPlayers {
  /** Current user group ("" by default). */
  group: string;

  /** Mapping from groups to players' Discord IDs. */
  players: Map<string, string[]>;
}

export function getPlayers(feignPlayers: FeignPlayers): string[] {
  return feignPlayers.players.get(feignPlayers.group) || Array(NUMBER_OF_FEI_COLORS).fill('');
}

export function numberOfActivePlayers(feignPlayers: FeignPlayers): number {
  return getPlayers(feignPlayers).filter((s) => s !== '').length;
}
