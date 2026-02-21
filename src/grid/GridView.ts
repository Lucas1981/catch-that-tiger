import { Container, Rectangle, Sprite, Texture } from 'pixi.js';
import { CONFIG } from '../config';
import { TILE_FRAMES } from './Tile';
import type { Grid } from './Grid';

/**
 * Renders the full grid as tile sprites at world positions.
 * The parent (ScrollEngine world) applies the camera offset for scrolling.
 */
export function createGridView(grid: Grid, spritesheetTexture: Texture): Container {
  const container = new Container();
  const tileSize = CONFIG.tileSize;

  const tileTextures: Map<number, Texture> = new Map();
  for (const [tileType, pos] of Object.entries(TILE_FRAMES)) {
    tileTextures.set(
      Number(tileType),
      new Texture({
        source: spritesheetTexture.source,
        frame: new Rectangle(pos.x, pos.y, tileSize, tileSize),
      })
    );
  }

  for (let gy = 0; gy < grid.height; gy++) {
    for (let gx = 0; gx < grid.width; gx++) {
      const tileType = grid.getTileAt(gx, gy) ?? 0;
      const tex = tileTextures.get(tileType) ?? tileTextures.get(0);
      if (!tex) continue;

      const sprite = new Sprite(tex);
      sprite.x = gx * tileSize;
      sprite.y = gy * tileSize;
      container.addChild(sprite);
    }
  }

  return container;
}
