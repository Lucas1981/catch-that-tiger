import { AgentType } from "../../agents/types";
import { resolveAgentGridCollision } from "../../collision/CollisionDetector";
import type { Agent } from "../../agents/Agent";
import type { Grid } from "../../grid/Grid";
import type { Renderer } from "../../graphics/Renderer";
import type { ScrollEngine } from "../../scroll/ScrollEngine";
import type { InputManager } from "../../input/InputManager";
import type { GameState } from "../GameState";

export type GameStateSetter = (state: GameState) => void;

export interface RunningContext {
  scrollEngine?: ScrollEngine;
  inputManager?: InputManager;
  agents?: Agent[];
  grid?: Grid;
}

/**
 * Handler for the RUNNING state (active gameplay).
 * Updates all agents, resolves grid collisions, camera follows player.
 */
export function handleRunning(
  _renderer: Renderer,
  _setGameState: GameStateSetter,
  context?: RunningContext,
): void {
  const { scrollEngine, agents = [], grid } = context ?? {};

  for (const agent of agents) {
    agent.update();
  }

  if (grid) {
    for (const agent of agents) {
      resolveAgentGridCollision(agent, grid);
    }
  }

  const player = agents.find((a) => a.type === AgentType.PLAYER);
  if (player && scrollEngine) {
    scrollEngine.follow(player.x, player.y);
  }

  for (const agent of agents) {
    if (agent.view) {
      agent.view.x = agent.x;
      agent.view.y = agent.y;
    }
  }
}
