import type { Renderer } from '../../graphics/Renderer';
import type { GameState } from '../GameState';

export type GameStateSetter = (state: GameState) => void;

/**
 * Handler for the TITLE state (e.g. title screen, press to start).
 * Stub implementation.
 */
export function handleTitle(
  _renderer: Renderer,
  _setGameState: GameStateSetter
): void {
  // TODO: Show title screen, wait for key/click to start
}
