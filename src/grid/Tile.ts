/**
 * Tile type constants. Used for grid data and texture lookup.
 * 0 = passable (floor), 1 = solid (wall).
 */
export const TILE_SOLID = 1 as const;
export const TILE_PASSABLE = 0 as const;

/**
 * Spritesheet frame positions for tile textures (128x128 each).
 * Tile 1 (solid): first tile at (0, 0)
 * Tile 0 (passable): second tile at (128, 0)
 */
export const TILE_FRAMES: Record<number, { x: number; y: number }> = {
  [TILE_PASSABLE]: { x: 128, y: 0 },
  [TILE_SOLID]: { x: 0, y: 0 },
};
