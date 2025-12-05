import { useCallback, useEffect, useMemo, useState } from 'react';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';
import { MAX_GUESSES, START_DATE, WORD_LENGTH } from './data/words';
import { RESET_DATES, RESET_TODAY } from './config';
import type { GameStatus } from './types';
import { toISODate } from './utils/date';
import { buildKeyboardState, isAlphaWord } from './utils/game';
import { getTodayPuzzle } from './utils/getTodayPuzzle';
import { loadGameState, saveGameState, storageKeyForDate } from './utils/storage';
import './App.css';

const Game = () => {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => toISODate(today), [today]);
  const shouldResetToday = useMemo(
    () => RESET_TODAY || RESET_DATES.includes(todayIso),
    [todayIso],
  );
  const puzzleResult = useMemo(() => getTodayPuzzle(today), [today]);
  const solution = puzzleResult.puzzle?.word ?? '';
  const storageKey = storageKeyForDate(todayIso);

  const initialState = useMemo(
    () => {
      if (shouldResetToday) {
        localStorage.removeItem(storageKey);
      }
      return loadGameState(storageKey) ?? { guesses: [], status: 'in_progress' as GameStatus };
    },
    [shouldResetToday, storageKey],
  );

  const [guesses, setGuesses] = useState<string[]>(initialState.guesses);
  const [status, setStatus] = useState<GameStatus>(initialState.status);
  const [currentGuess, setCurrentGuess] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(initialState.status !== 'in_progress');

  useEffect(() => {
    saveGameState(storageKey, { guesses, status });
  }, [guesses, status, storageKey]);

  const resetErrorSoon = useCallback(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 1200);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => resetErrorSoon(), [resetErrorSoon]);

  const handleAddLetter = useCallback(
    (letter: string) => {
      if (status !== 'in_progress' || puzzleResult.status !== 'available') return;
      if (currentGuess.length >= WORD_LENGTH) return;
      setCurrentGuess((prev) => `${prev}${letter}`);
    },
    [currentGuess.length, puzzleResult.status, status],
  );

  const handleBackspace = useCallback(() => {
    if (status !== 'in_progress') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [status]);

  const submitGuess = useCallback(() => {
    if (puzzleResult.status !== 'available' || !solution) return;
    if (status !== 'in_progress') {
      setShowModal(true);
      return;
    }

    const normalized = currentGuess.toUpperCase();

    if (normalized.length !== WORD_LENGTH) {
      setError(`Need ${WORD_LENGTH} letters`);
      return;
    }

    if (!isAlphaWord(normalized)) {
      setError('Letters A–Z only');
      return;
    }

    const nextGuesses = [...guesses, normalized];
    const didWin = normalized === solution;
    const nextStatus: GameStatus = didWin
      ? 'won'
      : nextGuesses.length >= MAX_GUESSES
        ? 'lost'
        : 'in_progress';

    setGuesses(nextGuesses);
    setStatus(nextStatus);
    setCurrentGuess('');
    setShowModal(nextStatus !== 'in_progress');
    setError('');
  }, [currentGuess, guesses, puzzleResult.status, solution, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (puzzleResult.status !== 'available') return;
      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        return;
      }
      if (event.key === 'Enter') {
        submitGuess();
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        handleAddLetter(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAddLetter, handleBackspace, puzzleResult.status, submitGuess]);

  const letterStates = useMemo(
    () => buildKeyboardState(guesses, solution),
    [guesses, solution],
  );

  const modalTitle =
    status === 'won' ? 'You got it! 🥰' : status === 'lost' ? 'Good try!' : '';

  const modalMessage =
    status === 'won'
      ? `You solved "${solution}".`
      : status === 'lost'
        ? `The word was "${solution}".`
        : '';

  const helperMessage =
    puzzleResult.status === 'not_started'
      ? `No puzzle yet. First puzzle unlocks on ${START_DATE}.`
      : puzzleResult.status === 'out_of_words'
        ? 'No puzzle configured for today. Add another word to the list.'
        : null;

  return (
    <div className="page">
      <header className="hero">
        <h1>Bub&apos;s Wordle &lt;3</h1>
      </header>

      {helperMessage ? (
        <div className="card info">{helperMessage}</div>
      ) : (
        <>
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess.toUpperCase()}
            solution={solution}
            maxGuesses={MAX_GUESSES}
            wordLength={WORD_LENGTH}
          />

          <Keyboard
            letterStates={letterStates}
            onEnter={submitGuess}
            onDelete={handleBackspace}
            onKey={handleAddLetter}
            disabled={status !== 'in_progress'}
          />

          <div className="card footer">
            <p>Guesses left: {MAX_GUESSES - guesses.length}</p>
            {error && <p className="error">{error}</p>}
            {status === 'in_progress' && (
              <p className="subtle">Use the keyboard or tap the keys to guess.</p>
            )}
          </div>
        </>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
        note={puzzleResult.puzzle?.note}
      />
    </div>
  );
};

export default Game;
