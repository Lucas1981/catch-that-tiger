import { CONFIG } from '../config';
import type { Agent } from './Agent';
import type { AgentBehaviour } from './types';
import type { Grid } from '../grid/Grid';
import { resolveAgentGridCollision } from '../collision/CollisionDetector';

const TILE_SIZE = CONFIG.tileSize;
const DIRECTION_INTERVAL = 16;

function randomDirection(): -1 | 0 | 1 {
  const r = Math.random();
  if (r < 1 / 3) return -1;
  if (r < 2 / 3) return 0;
  return 1;
}

/**
 * Creates the updatePrey behaviour. Prey flee from the player when within range,
 * otherwise choose random direction. Direction changes every 16 frames.
 */
export function createUpdatePreyBehaviour(
  getPlayer: () => Agent | undefined,
  grid: Grid,
  rangeTiles: number
): AgentBehaviour {
  const timers = new Map<Agent, number>();
  const rangePx = rangeTiles * TILE_SIZE;

  return (agent: Agent): void => {
    if (!agent.isAlive()) return;

    let count = timers.get(agent) ?? 0;
    count++;
    timers.set(agent, count);

    if (count >= DIRECTION_INTERVAL) {
      timers.set(agent, 0);
      const player = getPlayer();
      const ax = agent.x + agent.hitbox.x + agent.hitbox.width / 2;
      const ay = agent.y + agent.hitbox.y + agent.hitbox.height / 2;

      if (player?.isAlive()) {
        const px = player.x + player.hitbox.x + player.hitbox.width / 2;
        const py = player.y + player.hitbox.y + player.hitbox.height / 2;
        const dx = px - ax;
        const dy = py - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= rangePx && dist > 0) {
          agent.directionX = dx < 0 ? 1 : dx > 0 ? -1 : 0;
          agent.directionY = dy < 0 ? 1 : dy > 0 ? -1 : 0;
        } else {
          agent.directionX = randomDirection();
          agent.directionY = randomDirection();
        }
      } else {
        agent.directionX = randomDirection();
        agent.directionY = randomDirection();
      }
    }

    const s = agent.speed;
    agent.x += agent.directionX * s;
    resolveAgentGridCollision(agent, grid, 'x');
    agent.y += agent.directionY * s;
    resolveAgentGridCollision(agent, grid, 'y');
  };
}
