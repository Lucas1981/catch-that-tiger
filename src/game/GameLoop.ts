import type { Renderer } from "../graphics/Renderer";
import type { ScrollEngine } from "../scroll/ScrollEngine";
import type { InputManager } from "../input/InputManager";
import type { Agent } from "../agents/Agent";
import type { Grid } from "../grid/Grid";
import { GameState } from "./GameState";
import { handleTitle } from "./handlers/handleTitle";
import { handleRunning } from "./handlers/handleRunning";
import { handleLost } from "./handlers/handleLost";
import { handleWon } from "./handlers/handleWon";

/** Target frame interval in ms (~16.67ms for 60 FPS). */
const TARGET_FRAME_MS = 1000 / 60;

export interface GameLoopOptions {
  renderer: Renderer;
  initialState?: GameState;
  scrollEngine?: ScrollEngine;
  inputManager?: InputManager;
  agents?: Agent[];
  grid?: Grid;
}

/**
 * Main game loop with 60 FPS throttling.
 * Tracks elapsed time between frames and only runs one tick per ~16.67ms.
 */
export function runGameLoop(options: GameLoopOptions): void {
  const {
    renderer,
    initialState = GameState.TITLE,
    scrollEngine,
    inputManager,
    agents = [],
    grid,
  } = options;
  let gameState = initialState;
  let lastFrameTime = performance.now();

  const setGameState = (state: GameState): void => {
    gameState = state;
  };

  const tick = (): void => {
    switch (gameState) {
      case GameState.TITLE:
        handleTitle(renderer, setGameState);
        break;
      case GameState.RUNNING:
        handleRunning(renderer, setGameState, {
          scrollEngine,
          inputManager,
          agents,
          grid,
        });
        break;
      case GameState.LOST:
        handleLost(renderer, setGameState);
        break;
      case GameState.WON:
        handleWon(renderer, setGameState);
        break;
      default:
        break;
    }
  };

  const loop = (now: number): void => {
    requestAnimationFrame(loop);

    const elapsed = now - lastFrameTime;
    if (elapsed < TARGET_FRAME_MS) return;

    lastFrameTime = now;
    tick();
  };

  requestAnimationFrame(loop);
}
