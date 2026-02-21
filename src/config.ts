/**
 * Game configuration constants.
 */
export const CONFIG = {
  /** Default canvas dimensions (used when resizeTo is not set). */
  canvas: {
    width: 1280,
    height: 768,
  },
  /** Background color for the game (hex). */
  backgroundColor: 0x1a1a2e,
  /** Tile size in pixels (spritesheet frames are 128x128). */
  tileSize: 128,
  /** Viewport size in tiles (visible area). */
  viewportTiles: { width: 10, height: 6 },
  /** Camera movement speed in pixels per frame (for testing scroll). */
  cameraSpeed: 8,
  /** Player movement speed in pixels per frame. */
  playerSpeed: 8,
  /** Prey speeds: fast (orange), slow (green). */
  preySpeed: { fast: 7, slow: 5 },
  /** Enemy speeds: fast, slow. */
  enemySpeed: { fast: 6, slow: 4 },
} as const;
