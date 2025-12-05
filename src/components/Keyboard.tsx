import type { TileState } from '../types';

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

type Props = {
  letterStates: Map<string, TileState>;
  onEnter: () => void;
  onDelete: () => void;
  onKey: (letter: string) => void;
  disabled?: boolean;
};

const Keyboard = ({ letterStates, onEnter, onDelete, onKey, disabled }: Props) => {
  const renderKey = (label: string) => {
    const state = letterStates.get(label) ?? 'empty';
    return (
      <button
        key={label}
        className={`key ${state}`}
        onClick={() => onKey(label)}
        disabled={disabled}
        type="button"
      >
        {label}
      </button>
    );
  };

  return (
    <div className="keyboard">
      {KEY_ROWS.map((row) => (
        <div key={row} className="key-row">
          {row.split('').map(renderKey)}
          {row === 'ZXCVBNM' && (
            <>
              <button
                className="key action"
                onClick={onDelete}
                disabled={disabled}
                type="button"
              >
                ⌫
              </button>
              <button
                className="key action"
                onClick={onEnter}
                disabled={disabled}
                type="button"
              >
                Enter
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
