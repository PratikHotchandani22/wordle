import { evaluateGuess } from '../utils/game';
import TileRow from './TileRow';

type Props = {
  guesses: string[];
  currentGuess: string;
  solution: string;
  maxGuesses: number;
  wordLength: number;
};

const GameBoard = ({
  guesses,
  currentGuess,
  solution,
  maxGuesses,
  wordLength,
}: Props) => {
  const rows = Array.from({ length: maxGuesses }, (_, idx) => {
    const guess = guesses[idx];
    if (guess) {
      const states = evaluateGuess(guess, solution);
      return (
        <TileRow
          key={idx}
          letters={guess.split('')}
          states={states}
          wordLength={wordLength}
        />
      );
    }

    if (idx === guesses.length) {
      return (
        <TileRow
          key={idx}
          letters={currentGuess.split('')}
          wordLength={wordLength}
          isCurrent
        />
      );
    }

    return <TileRow key={idx} letters={[]} wordLength={wordLength} />;
  });

  return <div className="board">{rows}</div>;
};

export default GameBoard;
