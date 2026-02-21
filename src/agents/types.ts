import type { Agent } from './Agent';

/** Agent type for identification and behaviour selection. */
export enum AgentType {
  PLAYER = 'player',
  ENEMY = 'enemy',
  PREY = 'prey',
  ITEM = 'item',
}

/** Behaviour function: receives the agent to manipulate. */
export type AgentBehaviour = (agent: Agent) => void;
