import type { Agent } from './Agent';
import type { AgentBehaviour } from './types';
import type { InputManager } from '../input/InputManager';

/**
 * Creates the updatePlayer behaviour. The returned function takes only the agent;
 * it reads input from the captured InputManager and updates direction and position.
 * Player can move freely (no collision yet).
 */
export function createUpdatePlayerBehaviour(
  inputManager: InputManager
): AgentBehaviour {
  return (agent: Agent): void => {
    const direction = inputManager.getDirection();
    agent.directionX = direction.x;
    agent.directionY = direction.y;
    agent.x += agent.directionX * agent.speed;
    agent.y += agent.directionY * agent.speed;
  };
}
