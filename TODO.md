# Catch That Tiger - Progress Tracker

> **For agents:** Update this file as tasks are completed. Check off items and add dates when done.

## Phase 1: Foundation

- [x] **1.1** Project setup — Vite, TypeScript, PixiJS, Howler, basic HTML entry
- [x] **1.2** Graphics — PixiJS Application, stage, resize handling, layers
- [x] **1.3** Main loop and game state — GameLoop.ts, 60fps throttling, GameState enum, stub handlers

## Phase 2: World

- [x] **2.1** Grid system — Tile data structure, grid dimensions, tile indexing, gridmap asset, 10x6 view
- [x] **2.2** Scrolling engine — Camera with sub-tile offset, input for testing
- [x] **2.3** Collision — Agent hitbox, grid collision, reposition on solid tiles

## Phase 3: Agents

- [ ] **3.1** Animation engine — FrameRecord, SpritesheetFlyweight, AnimationDefinition, Animator
- [x] **3.2** Agents — Agent class, AgentType enum, behaviours, AgentFactory
- [x] **3.3** Input — InputManager, updatePlayer, camera follow, agents array

## Phase 4: Polish

- [ ] **4.1** Sound — SoundManager, load and play effects
- [ ] **4.2** Handlers — handleTitle, handleRunning, handleLost, handleWon
- [ ] **4.3** Content and tuning — Placeholder sprites, level layout, scoring, win/lose conditions
