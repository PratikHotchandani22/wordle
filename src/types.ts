export type GameStatus = 'in_progress' | 'won' | 'lost';

export type TileState = 'correct' | 'present' | 'absent' | 'empty';

export type LoveWord = {
  word: string; // uppercase, fixed length
  note?: string;
};

export type GameState = {
  guesses: string[];
  status: GameStatus;
};
