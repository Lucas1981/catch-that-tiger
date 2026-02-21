import { Application, Container } from 'pixi.js';
import { CONFIG } from '../config';

/**
 * Layer IDs for render ordering. First added = bottom (back).
 */
export const LAYERS = {
  BACKGROUND: 'background',
  AGENTS: 'agents',
  UI: 'ui',
} as const;

type LayerId = (typeof LAYERS)[keyof typeof LAYERS];

/**
 * Wraps the PixiJS Application and provides layered containers for rendering.
 * Uses PixiJS v8 best practices: async init(), resizeTo for responsive canvas.
 */
export class Renderer {
  readonly app: Application;
  private layers = new Map<LayerId, Container>();

  constructor() {
    this.app = new Application();
  }

  /**
   * Initialize the renderer. Call once before use.
   * Uses fixed dimensions from config unless resizeTo is provided.
   */
  async init(options?: { resizeTo?: Window | HTMLElement }): Promise<void> {
    await this.app.init({
      width: CONFIG.canvas.width,
      height: CONFIG.canvas.height,
      backgroundColor: CONFIG.backgroundColor,
      resizeTo: options?.resizeTo,
      antialias: true,
    });

    this.setupLayers();
  }

  private setupLayers(): void {
    const order: LayerId[] = [LAYERS.BACKGROUND, LAYERS.AGENTS, LAYERS.UI];
    for (const id of order) {
      const container = new Container();
      container.label = id;
      this.layers.set(id, container);
      this.app.stage.addChild(container);
    }
  }

  /** Get a layer container by ID. */
  getLayer(id: LayerId): Container {
    const layer = this.layers.get(id);
    if (!layer) throw new Error(`Unknown layer: ${id}`);
    return layer;
  }

  /** The root stage (all layers). */
  get stage(): Container {
    return this.app.stage;
  }

  /** The canvas element to append to the DOM. */
  get canvas(): HTMLCanvasElement {
    return this.app.canvas;
  }
}
