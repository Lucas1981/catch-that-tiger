import { Assets } from 'pixi.js';
import type { GridMapData } from '../grid/types';

const ASSETS_BASE = '/assets';

/** Load the spritesheet texture. */
export async function loadSpritesheet() {
  return Assets.load(`${ASSETS_BASE}/spritesheet.png`);
}

/** Load the gridmap JSON asset. */
export async function loadGridMap(): Promise<GridMapData> {
  const res = await fetch(`${ASSETS_BASE}/gridmap.json`);
  if (!res.ok) throw new Error(`Failed to load gridmap: ${res.status}`);
  return res.json();
}
