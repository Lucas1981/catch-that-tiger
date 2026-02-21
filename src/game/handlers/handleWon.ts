import type { Renderer } from '../../graphics/Renderer';
import type { GameState } from '../GameState';

export type GameStateSetter = (state: GameState) => void;

/**
 * Handler for the WON state (level complete).
 * Stub implementation.
 */
export function handleWon(
  _renderer: Renderer,
  _setGameState: GameStateSetter
): void {
  // TODO: Show victory, restart option
}
