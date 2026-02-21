import { CONFIG } from '../config';
import type { Agent } from '../agents/Agent';
import type { Grid } from '../grid/Grid';

const T = CONFIG.tileSize;

function overlappingSolids(
  left: number, top: number, right: number, bottom: number, grid: Grid
): [number, number][] {
  const out: [number, number][] = [];
  const minGx = Math.max(0, Math.floor(left / T));
  const maxGx = Math.min(grid.width - 1, Math.floor((right - 1) / T));
  const minGy = Math.max(0, Math.floor(top / T));
  const maxGy = Math.min(grid.height - 1, Math.floor((bottom - 1) / T));
  for (let gy = minGy; gy <= maxGy; gy++)
    for (let gx = minGx; gx <= maxGx; gx++)
      if (grid.getTileAt(gx, gy) !== 0) out.push([gx, gy]);
  return out;
}

function resolveX(agent: Agent, grid: Grid): void {
  if (agent.directionX === 0) return;
  const h = agent.hitbox;
  const left = agent.x + h.x, right = agent.x + h.x + h.width;
  const top = agent.y + h.y, bottom = agent.y + h.y + h.height;
  const cx = agent.x + h.x + h.width / 2;
  let best: number | null = null;
  for (const [gx] of overlappingSolids(left, top, right, bottom, grid)) {
    const tL = gx * T, tR = (gx + 1) * T, tCx = (gx + 0.5) * T;
    const tileOnLeft = tCx < cx;
    if (agent.directionX === -1 && tileOnLeft) {
      const nx = tR - h.x;
      if (best === null || nx > best) best = nx;
    } else if (agent.directionX === 1 && !tileOnLeft) {
      const nx = tL - h.x - h.width;
      if (best === null || nx < best) best = nx;
    }
  }
  if (best !== null) agent.x = best;
}

function resolveY(agent: Agent, grid: Grid): void {
  if (agent.directionY === 0) return;
  const h = agent.hitbox;
  const left = agent.x + h.x, right = agent.x + h.x + h.width;
  const top = agent.y + h.y, bottom = agent.y + h.y + h.height;
  const cy = agent.y + h.y + h.height / 2;
  let best: number | null = null;
  for (const [, gy] of overlappingSolids(left, top, right, bottom, grid)) {
    const tT = gy * T, tB = (gy + 1) * T, tCy = (gy + 0.5) * T;
    const tileAbove = tCy < cy;
    if (agent.directionY === -1 && tileAbove) {
      const ny = tB - h.y;
      if (best === null || ny > best) best = ny;
    } else if (agent.directionY === 1 && !tileAbove) {
      const ny = tT - h.y - h.height;
      if (best === null || ny < best) best = ny;
    }
  }
  if (best !== null) agent.y = best;
}

/** Resolve grid collision for one axis. Call after moving on that axis. */
export function resolveAgentGridCollision(
  agent: Agent,
  grid: Grid,
  axis: 'x' | 'y'
): void {
  if (axis === 'x') resolveX(agent, grid);
  else resolveY(agent, grid);
}
