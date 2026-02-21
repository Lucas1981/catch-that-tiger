import type { Container } from 'pixi.js';
import type { TileType } from './types';
import type { GridMapData } from './types';

/**
 * Grid system for a tile-based world.
 * Tiles are stored in row-major order (y * width + x).
 */
export class Grid {
  readonly width: number;
  readonly height: number;
  readonly tileSize: number;
  private readonly data: TileType[];

  constructor(mapData: GridMapData) {
    this.width = mapData.width;
    this.height = mapData.height;
    this.tileSize = mapData.tileSize;
    this.data = [...mapData.data];
  }

  /** Get tile type at grid coordinates. Returns undefined if out of bounds. */
  getTileAt(x: number, y: number): TileType | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
    return this.data[y * this.width + x];
  }

  /** Check if the tile at (x, y) is walkable (non-solid). */
  isWalkable(x: number, y: number): boolean {
    const tile = this.getTileAt(x, y);
    return tile === 0;
  }

  /** Convert grid index to linear index. */
  index(x: number, y: number): number {
    return y * this.width + x;
  }
}
