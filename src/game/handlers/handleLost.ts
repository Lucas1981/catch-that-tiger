import type { Renderer } from '../../graphics/Renderer';
import type { GameState } from '../GameState';

export type GameStateSetter = (state: GameState) => void;

/**
 * Handler for the LOST state (game over, player was caught).
 * Stub implementation.
 */
export function handleLost(
  _renderer: Renderer,
  _setGameState: GameStateSetter
): void {
  // TODO: Show game over, restart option
}
