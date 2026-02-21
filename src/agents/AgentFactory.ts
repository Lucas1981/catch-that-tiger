import { Rectangle, Sprite, Texture } from "pixi.js";
import type { Container } from "pixi.js";
import { CONFIG } from "../config";
import { Agent } from "./Agent";
import { AgentType, AgentState } from "./types";
import { createUpdatePlayerBehaviour } from "./updatePlayer";
import { createUpdatePreyBehaviour } from "./updatePrey";
import type { InputManager } from "../input/InputManager";
import type { Grid } from "../grid/Grid";

const TILE_SIZE = CONFIG.tileSize;
const PREY_RANGE_TILES = 8;

function tilesOccupiedBy(agent: Agent): Set<string> {
  const h = agent.hitbox;
  const left = agent.x + h.x;
  const top = agent.y + h.y;
  const right = left + h.width;
  const bottom = top + h.height;
  const minGx = Math.floor(left / TILE_SIZE);
  const maxGx = Math.floor((right - 1) / TILE_SIZE);
  const minGy = Math.floor(top / TILE_SIZE);
  const maxGy = Math.floor((bottom - 1) / TILE_SIZE);
  const out = new Set<string>();
  for (let gy = minGy; gy <= maxGy; gy++)
    for (let gx = minGx; gx <= maxGx; gx++) out.add(`${gx},${gy}`);
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getValidSpawnPositions(
  grid: Grid,
  occupied: Set<string>,
  playerCenterX: number,
  playerCenterY: number,
  minDistPx: number,
): [number, number][] {
  const valid: [number, number][] = [];
  const minDistSq = minDistPx * minDistPx;
  for (let gy = 0; gy < grid.height; gy++) {
    for (let gx = 0; gx < grid.width; gx++) {
      if (grid.getTileAt(gx, gy) !== 0) continue;
      if (occupied.has(`${gx},${gy}`)) continue;
      const cx = gx * TILE_SIZE + TILE_SIZE / 2;
      const cy = gy * TILE_SIZE + TILE_SIZE / 2;
      const dx = cx - playerCenterX;
      const dy = cy - playerCenterY;
      if (dx * dx + dy * dy < minDistSq) continue;
      valid.push([gx, gy]);
    }
  }
  return shuffle(valid);
}

/** Spritesheet frames (128x128 each). */
const FRAMES = {
  player: { x: 256, y: 0 },
  preyOrange: { x: 0, y: 128 },
  preyGreen: { x: 128, y: 128 },
} as const;

export type PreyVariant = "fast" | "slow";

/**
 * Create a player agent with sprite representation.
 * Adds the sprite to the world container for correct scrolling.
 * Uses createUpdatePlayerBehaviour for input-driven movement.
 */
export function createPlayer(
  x: number,
  y: number,
  world: Container,
  spritesheetTexture: Texture,
  inputManager: InputManager,
  grid: Grid,
): Agent {
  const tileSize = CONFIG.tileSize;
  const playerTexture = new Texture({
    source: spritesheetTexture.source,
    frame: new Rectangle(FRAMES.player.x, FRAMES.player.y, tileSize, tileSize),
  });

  const sprite = new Sprite(playerTexture);
  sprite.x = x;
  sprite.y = y;

  world.addChild(sprite);

  const agent = new Agent({
    type: AgentType.PLAYER,
    x,
    y,
    state: AgentState.ALIVE,
    speed: CONFIG.playerSpeed,
    directionX: 0,
    directionY: 0,
    hitbox: { x: 32, y: 32, width: 63, height: 63 },
    behaviours: [createUpdatePlayerBehaviour(inputManager, grid)],
  });

  agent.view = sprite;
  return agent;
}

/**
 * Create a prey agent. Fast = orange, slow = green. Uses createUpdatePreyBehaviour.
 */
export function createPrey(
  x: number,
  y: number,
  variant: PreyVariant,
  world: Container,
  spritesheetTexture: Texture,
  grid: Grid,
  getPlayer: () => Agent | undefined,
): Agent {
  const frame = variant === "fast" ? FRAMES.preyOrange : FRAMES.preyGreen;
  const speed = CONFIG.preySpeed[variant];
  const texture = new Texture({
    source: spritesheetTexture.source,
    frame: new Rectangle(frame.x, frame.y, TILE_SIZE, TILE_SIZE),
  });

  const sprite = new Sprite(texture);
  sprite.x = x;
  sprite.y = y;
  world.addChild(sprite);

  const agent = new Agent({
    type: AgentType.PREY,
    x,
    y,
    state: AgentState.ALIVE,
    speed,
    directionX: 0,
    directionY: 0,
    hitbox: { x: 32, y: 32, width: 64, height: 64 },
    behaviours: [createUpdatePreyBehaviour(getPlayer, grid, PREY_RANGE_TILES)],
  });

  agent.view = sprite;
  return agent;
}

/**
 * Generate prey with random placement. Spawns on passable tiles, avoids other
 * agents and positions within PREY_RANGE_TILES of the player.
 */
export function generatePrey(
  countFast: number,
  countSlow: number,
  world: Container,
  spritesheetTexture: Texture,
  grid: Grid,
  getPlayer: () => Agent | undefined,
  existingAgents: Agent[],
): Agent[] {
  const player = getPlayer();
  const playerCenterX = player
    ? player.x + player.hitbox.x + player.hitbox.width / 2
    : -9999;
  const playerCenterY = player
    ? player.y + player.hitbox.y + player.hitbox.height / 2
    : -9999;
  const minDistPx = PREY_RANGE_TILES * TILE_SIZE;

  let occupied = new Set<string>();
  for (const a of existingAgents) {
    for (const k of tilesOccupiedBy(a)) occupied.add(k);
  }

  const validPositions = getValidSpawnPositions(
    grid,
    occupied,
    playerCenterX,
    playerCenterY,
    minDistPx,
  );

  const result: Agent[] = [];
  const toSpawn: PreyVariant[] = [
    ...Array(countFast).fill("fast"),
    ...Array(countSlow).fill("slow"),
  ];

  let posIndex = 0;
  for (const variant of toSpawn) {
    if (posIndex >= validPositions.length) break;
    const [gx, gy] = validPositions[posIndex++];
    const x = gx * TILE_SIZE;
    const y = gy * TILE_SIZE;
    const agent = createPrey(
      x,
      y,
      variant,
      world,
      spritesheetTexture,
      grid,
      getPlayer,
    );
    result.push(agent);
  }

  return result;
}
