import { Rectangle, Sprite, Texture } from 'pixi.js';
import type { Container } from 'pixi.js';
import { CONFIG } from '../config';
import { Agent } from './Agent';
import { AgentType } from './types';
import { createUpdatePlayerBehaviour } from './updatePlayer';
import type { InputManager } from '../input/InputManager';
import type { Grid } from '../grid/Grid';

/** Spritesheet frame for player (128x128 at x=256). */
const PLAYER_FRAME = { x: 256, y: 0 };

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
  grid: Grid
): Agent {
  const tileSize = CONFIG.tileSize;
  const playerTexture = new Texture({
    source: spritesheetTexture.source,
    frame: new Rectangle(
      PLAYER_FRAME.x,
      PLAYER_FRAME.y,
      tileSize,
      tileSize
    ),
  });

  const sprite = new Sprite(playerTexture);
  sprite.x = x;
  sprite.y = y;

  world.addChild(sprite);

  const agent = new Agent({
    type: AgentType.PLAYER,
    x,
    y,
    speed: CONFIG.playerSpeed,
    directionX: 0,
    directionY: 0,
    hitbox: { x: 32, y: 32, width: 64, height: 64 },
    behaviours: [createUpdatePlayerBehaviour(inputManager, grid)],
  });

  agent.view = sprite;
  return agent;
}
