import { Container } from 'pixi.js';
import { CONFIG } from '../config';
import type { Direction } from '../input/types';

/**
 * Camera position in world pixels. Supports sub-tile granularity.
 */
export interface Camera {
  x: number;
  y: number;
}

/**
 * Scroll engine: manages camera position and a world container whose
 * transform applies the camera offset for scrolling.
 */
export class ScrollEngine {
  readonly world: Container;
  private _camera: Camera;
  private readonly maxX: number;
  private readonly maxY: number;

  constructor(
    gridWidthTiles: number,
    gridHeightTiles: number
  ) {
    this.world = new Container();
    this.world.label = 'scrollWorld';

    const tileSize = CONFIG.tileSize;
    const viewWidth = CONFIG.viewportTiles.width * tileSize;
    const viewHeight = CONFIG.viewportTiles.height * tileSize;
    const worldWidth = gridWidthTiles * tileSize;
    const worldHeight = gridHeightTiles * tileSize;

    this.maxX = Math.max(0, worldWidth - viewWidth);
    this.maxY = Math.max(0, worldHeight - viewHeight);

    this._camera = { x: 0, y: 0 };
    this.applyCamera();
  }

  get camera(): Readonly<Camera> {
    return this._camera;
  }

  /** Move camera by direction. Pixel delta per axis; call once per frame. */
  move(direction: Direction, pixelsPerFrame: number): void {
    this._camera.x += direction.x * pixelsPerFrame;
    this._camera.y += direction.y * pixelsPerFrame;
    this._camera.x = Math.max(0, Math.min(this.maxX, this._camera.x));
    this._camera.y = Math.max(0, Math.min(this.maxY, this._camera.y));
    this.applyCamera();
  }

  /**
   * Center camera on target position, clamped to scene bounds.
   * When near an edge, camera stops moving so the target can approach the edge.
   */
  follow(targetX: number, targetY: number): void {
    const viewWidth = CONFIG.viewportTiles.width * CONFIG.tileSize;
    const viewHeight = CONFIG.viewportTiles.height * CONFIG.tileSize;
    const halfWidth = viewWidth / 2;
    const halfHeight = viewHeight / 2;

    const idealX = targetX - halfWidth;
    const idealY = targetY - halfHeight;

    this._camera.x = Math.max(0, Math.min(this.maxX, idealX));
    this._camera.y = Math.max(0, Math.min(this.maxY, idealY));
    this.applyCamera();
  }

  private applyCamera(): void {
    this.world.x = -this._camera.x;
    this.world.y = -this._camera.y;
  }
}
