import type { Direction } from './types';

/**
 * Tracks keyboard input for WASD and Arrow keys.
 * Returns -1, 0, or 1 per axis. Reusable for camera and later for player control.
 */
export class InputManager {
  private keys = new Set<string>();

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  /** Get current direction from pressed keys. */
  getDirection(): Direction {
    let x = 0;
    let y = 0;

    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) x = -1;
    else if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) x = 1;

    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) y = -1;
    else if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) y = 1;

    return { x, y };
  }

  destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
    }
  }
}
