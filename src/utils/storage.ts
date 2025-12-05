import type { GameState } from '../types';

const STORAGE_PREFIX = 'love-wordle';

export const storageKeyForDate = (dateIso: string) => `${STORAGE_PREFIX}-${dateIso}`;

export const loadGameState = (key: string): GameState | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (error) {
    console.error('Failed to read game state', error);
    return null;
  }
};

export const saveGameState = (key: string, state: GameState) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state', error);
  }
};
