import type { Sprite } from 'pixi.js';
import { AgentType, type AgentBehaviour } from './types';
import type { Hitbox } from '../collision/types';

export interface AgentOptions {
  type: AgentType;
  x?: number;
  y?: number;
  state?: unknown;
  speed?: number;
  directionX?: number;
  directionY?: number;
  hitbox?: Hitbox;
  behaviours?: AgentBehaviour[];
}

/**
 * Agent with configurable type, position, state, movement, and behaviours.
 * Behaviours are invoked by update() and can manipulate the agent.
 */
export class Agent {
  readonly type: AgentType;

  private _x = 0;
  private _y = 0;
  private _state: unknown = null;

  speed = 0;
  directionX = 0;
  directionY = 0;

  /** Display object (e.g. Sprite) for rendering. */
  view?: Sprite;

  /** Hitbox offset and size for collision (default: 0,0,128,128). */
  hitbox: Hitbox = { x: 0, y: 0, width: 128, height: 128 };

  private readonly behaviours: AgentBehaviour[] = [];

  constructor(options: AgentOptions) {
    this.type = options.type;
    this._x = options.x ?? 0;
    this._y = options.y ?? 0;
    this._state = options.state ?? null;
    this.speed = options.speed ?? 0;
    this.directionX = options.directionX ?? 0;
    this.directionY = options.directionY ?? 0;
    this.hitbox = options.hitbox ?? { x: 0, y: 0, width: 128, height: 128 };
    this.behaviours = options.behaviours ?? [];
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get state(): unknown {
    return this._state;
  }

  set state(value: unknown) {
    this._state = value;
  }

  /** Run all behaviour functions, passing this agent. */
  update(): void {
    for (const fn of this.behaviours) {
      fn(this);
    }
  }
}
