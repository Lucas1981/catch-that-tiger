import type { Agent } from './Agent';
import type { AgentBehaviour } from './types';
import type { InputManager } from '../input/InputManager';
import type { Grid } from '../grid/Grid';
import { resolveAgentGridCollision } from '../collision/CollisionDetector';

/**
 * Creates the updatePlayer behaviour. Reads input, moves per-axis with grid collision.
 * Pass grid for collision; omit for movement without resolution.
 */
export function createUpdatePlayerBehaviour(
  inputManager: InputManager,
  grid?: Grid
): AgentBehaviour {
  return (agent: Agent): void => {
    const dir = inputManager.getDirection();
    agent.directionX = dir.x;
    agent.directionY = dir.y;
    const s = agent.speed;

    agent.x += agent.directionX * s;
    if (grid) resolveAgentGridCollision(agent, grid, 'x');

    agent.y += agent.directionY * s;
    if (grid) resolveAgentGridCollision(agent, grid, 'y');
  };
}
