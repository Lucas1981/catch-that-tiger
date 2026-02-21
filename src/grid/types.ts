/**
 * Tile type: 0 = passable, 1 = solid.
 */
export type TileType = 0 | 1;

/**
 * Loaded gridmap asset data.
 */
export interface GridMapData {
  width: number;
  height: number;
  tileSize: number;
  data: TileType[];
}
