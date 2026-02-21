/**
 * Game state enum. The main loop switches on this to dispatch to the appropriate handler.
 */
export enum GameState {
  TITLE = 'TITLE',
  RUNNING = 'RUNNING',
  LOST = 'LOST',
  WON = 'WON',
}
