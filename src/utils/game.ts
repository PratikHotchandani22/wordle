import type { TileState } from '../types';

const stateRank: Record<TileState, number> = {
  empty: -1,
  absent: 0,
  present: 1,
  correct: 2,
};

export const isAlphaWord = (value: string) => /^[A-Z]+$/.test(value);

export const evaluateGuess = (guess: string, solution: string): TileState[] => {
  const length = solution.length;
  const result: TileState[] = Array.from({ length }, () => 'absent');
  const solutionChars = solution.split('');
  const used: boolean[] = Array.from({ length }, () => false);

  // First pass: exact matches
  for (let i = 0; i < length; i += 1) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: present letters respecting duplicates
  for (let i = 0; i < length; i += 1) {
    if (result[i] === 'correct') continue;
    const letter = guess[i];
    const matchIndex = solutionChars.findIndex(
      (ch, idx) => !used[idx] && ch === letter,
    );

    if (matchIndex !== -1) {
      result[i] = 'present';
      used[matchIndex] = true;
    } else {
      result[i] = 'absent';
    }
  }

  return result;
};

export const buildKeyboardState = (guesses: string[], solution: string) => {
  const map = new Map<string, TileState>();

  guesses.forEach((guess) => {
    const states = evaluateGuess(guess, solution);
    guess.split('').forEach((letter, idx) => {
      const current = map.get(letter) ?? 'empty';
      const next = states[idx];
      if (stateRank[next] > stateRank[current]) {
        map.set(letter, next);
      }
    });
  });

  return map;
};
