import { CONFIG } from './config';
import { Renderer, LAYERS } from './graphics/Renderer';
import { runGameLoop } from './game/GameLoop';
import { GameState } from './game/GameState';
import { loadSpritesheet, loadGridMap } from './assets/loadAssets';
import { Grid } from './grid/Grid';
import { createGridView } from './grid/GridView';
import { ScrollEngine } from './scroll/ScrollEngine';
import { InputManager } from './input/InputManager';
import { createPlayer, generatePrey, generateEnemies } from './agents/AgentFactory';

async function init(): Promise<void> {
  const renderer = new Renderer();
  await renderer.init();

  document.body.appendChild(renderer.canvas);

  const [spritesheetTexture, gridMapData] = await Promise.all([
    loadSpritesheet(),
    loadGridMap(),
  ]);

  const grid = new Grid(gridMapData);
  const scrollEngine = new ScrollEngine(grid.width, grid.height);

  const gridView = createGridView(grid, spritesheetTexture);
  scrollEngine.world.addChild(gridView);

  renderer.getLayer(LAYERS.BACKGROUND).addChild(scrollEngine.world);

  const worldSizePx = grid.width * CONFIG.tileSize;
  const centerX = worldSizePx / 2;
  const centerY = worldSizePx / 2;

  const inputManager = new InputManager();

  const player = createPlayer(
    centerX,
    centerY,
    scrollEngine.world,
    spritesheetTexture,
    inputManager,
    grid
  );

  const getPlayer = () => player;

  const prey = generatePrey(
    6,
    6,
    scrollEngine.world,
    spritesheetTexture,
    grid,
    getPlayer,
    [player]
  );

  const enemies = generateEnemies(
    1,
    1,
    scrollEngine.world,
    spritesheetTexture,
    grid,
    getPlayer,
    [player, ...prey]
  );

  const agents = [player, ...prey, ...enemies];

  scrollEngine.follow(player.x, player.y);

  runGameLoop({
    renderer,
    initialState: GameState.RUNNING,
    scrollEngine,
    inputManager,
    agents,
  });
}

init().catch((err) => console.error('Failed to init:', err));
