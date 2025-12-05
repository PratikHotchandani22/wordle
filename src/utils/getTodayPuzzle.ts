import { LOVE_WORDS, START_DATE } from '../data/words';
import type { LoveWord } from '../types';
import { daysBetween } from './date';

export type PuzzleStatus = 'available' | 'not_started' | 'out_of_words';

export type PuzzleResult = {
  puzzle: LoveWord | null;
  status: PuzzleStatus;
  dayIndex: number;
};

const startDateAsDate = () => new Date(`${START_DATE}T00:00:00`);

export const getTodayPuzzle = (todayDate = new Date()): PuzzleResult => {
  const dayIndex = daysBetween(startDateAsDate(), todayDate);

  if (dayIndex < 0) {
    return { puzzle: null, status: 'not_started', dayIndex };
  }

  if (dayIndex >= LOVE_WORDS.length) {
    return { puzzle: null, status: 'out_of_words', dayIndex };
  }

  return { puzzle: LOVE_WORDS[dayIndex], status: 'available', dayIndex };
};
