import type { Agent } from './Agent';
import type { AgentBehaviour } from './types';
import type { Grid } from '../grid/Grid';
import { resolveAgentGridCollision } from '../collision/CollisionDetector';

const DIRECTION_INTERVAL = 16;

function randomDirection(): -1 | 0 | 1 {
  const r = Math.random();
  if (r < 1 / 3) return -1;
  if (r < 2 / 3) return 0;
  return 1;
}

/**
 * Creates the updateEnemy behaviour. Enemies chase the player across the full scene.
 * Direction changes every 16 frames.
 */
export function createUpdateEnemyBehaviour(
  getPlayer: () => Agent | undefined,
  grid: Grid
): AgentBehaviour {
  const timers = new Map<Agent, number>();

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
        agent.directionX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        agent.directionY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      } else {
        agent.directionX = randomDirection();
        agent.directionY = randomDirection();
      }
    }

    const player = getPlayer();
    const s = agent.speed;
    const stepX = agent.directionX * s;
    const stepY = agent.directionY * s;

    if (player?.isAlive()) {
      const ax = agent.x + agent.hitbox.x + agent.hitbox.width / 2;
      const ay = agent.y + agent.hitbox.y + agent.hitbox.height / 2;
      const px = player.x + player.hitbox.x + player.hitbox.width / 2;
      const py = player.y + player.hitbox.y + player.hitbox.height / 2;

      const overshootX =
        (agent.directionX > 0 && ax < px && ax + stepX >= px) ||
        (agent.directionX < 0 && ax > px && ax + stepX <= px);
      const overshootY =
        (agent.directionY > 0 && ay < py && ay + stepY >= py) ||
        (agent.directionY < 0 && ay > py && ay + stepY <= py);

      if (overshootX) {
        agent.x = player.x;
        agent.directionX = 0;
      } else {
        agent.x += stepX;
      }
      resolveAgentGridCollision(agent, grid, 'x');

      if (overshootY) {
        agent.y = player.y;
        agent.directionY = 0;
      } else {
        agent.y += stepY;
      }
      resolveAgentGridCollision(agent, grid, 'y');
    } else {
      agent.x += stepX;
      resolveAgentGridCollision(agent, grid, 'x');
      agent.y += stepY;
      resolveAgentGridCollision(agent, grid, 'y');
    }
  };
}
