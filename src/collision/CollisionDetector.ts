import { CONFIG } from '../config';
import type { Agent } from '../agents/Agent';
import type { Grid } from '../grid/Grid';

const TILE_SIZE = CONFIG.tileSize;

function getOverlappingTiles(
  left: number,
  top: number,
  right: number,
  bottom: number,
  grid: Grid
): [number, number][] {
  const minGx = Math.max(0, Math.floor(left / TILE_SIZE));
  const maxGx = Math.min(grid.width - 1, Math.floor((right - 1) / TILE_SIZE));
  const minGy = Math.max(0, Math.floor(top / TILE_SIZE));
  const maxGy = Math.min(grid.height - 1, Math.floor((bottom - 1) / TILE_SIZE));
  const result: [number, number][] = [];
  for (let gy = minGy; gy <= maxGy; gy++) {
    for (let gx = minGx; gx <= maxGx; gx++) {
      if (grid.getTileAt(gx, gy) !== 0) {
        result.push([gx, gy]);
      }
    }
  }
  return result;
}

/**
 * Resolve agent overlap with solid grid tiles by repositioning.
 * Resolves X then Y. Repositions so hitbox touches tile edge in movement direction.
 */
export function resolveAgentGridCollision(agent: Agent, grid: Grid): void {
  const hitbox = agent.hitbox;
  let left = agent.x + hitbox.x;
  let top = agent.y + hitbox.y;
  let right = agent.x + hitbox.x + hitbox.width;
  let bottom = agent.y + hitbox.y + hitbox.height;

  const agentCenterX = agent.x + hitbox.x + hitbox.width / 2;
  const agentCenterY = agent.y + hitbox.y + hitbox.height / 2;

  if (agent.directionX === -1) {
    const tiles = getOverlappingTiles(left, top, right, bottom, grid);
    let bestX: number | null = null;
    for (const [gx] of tiles) {
      const tileRight = (gx + 1) * TILE_SIZE;
      const tileCenterX = (gx + 0.5) * TILE_SIZE;
      if (tileCenterX < agentCenterX) {
        const newX = tileRight - hitbox.x;
        if (bestX === null || newX > bestX) bestX = newX;
      }
    }
    if (bestX !== null) {
      agent.x = bestX;
      left = agent.x + hitbox.x;
      right = agent.x + hitbox.x + hitbox.width;
    }
  }

  if (agent.directionX === 1) {
    const tiles = getOverlappingTiles(left, top, right, bottom, grid);
    let bestX: number | null = null;
    for (const [gx] of tiles) {
      const tileLeft = gx * TILE_SIZE;
      const tileCenterX = (gx + 0.5) * TILE_SIZE;
      if (tileCenterX > agentCenterX) {
        const newX = tileLeft - hitbox.x - hitbox.width;
        if (bestX === null || newX < bestX) bestX = newX;
      }
    }
    if (bestX !== null) {
      agent.x = bestX;
      left = agent.x + hitbox.x;
      right = agent.x + hitbox.x + hitbox.width;
    }
  }

  if (agent.directionY === -1) {
    const tiles = getOverlappingTiles(left, top, right, bottom, grid);
    let bestY: number | null = null;
    for (const [, gy] of tiles) {
      const tileBottom = (gy + 1) * TILE_SIZE;
      const tileCenterY = (gy + 0.5) * TILE_SIZE;
      if (tileCenterY < agentCenterY) {
        const newY = tileBottom - hitbox.y;
        if (bestY === null || newY > bestY) bestY = newY;
      }
    }
    if (bestY !== null) {
      agent.y = bestY;
      top = agent.y + hitbox.y;
      bottom = agent.y + hitbox.y + hitbox.height;
    }
  }

  if (agent.directionY === 1) {
    const tiles = getOverlappingTiles(left, top, right, bottom, grid);
    let bestY: number | null = null;
    for (const [, gy] of tiles) {
      const tileTop = gy * TILE_SIZE;
      const tileCenterY = (gy + 0.5) * TILE_SIZE;
      if (tileCenterY > agentCenterY) {
        const newY = tileTop - hitbox.y - hitbox.height;
        if (bestY === null || newY < bestY) bestY = newY;
      }
    }
    if (bestY !== null) agent.y = bestY;
  }
}
