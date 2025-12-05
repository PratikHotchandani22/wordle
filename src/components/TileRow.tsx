import type { CSSProperties } from 'react';
import type { TileState } from '../types';

type Props = {
  letters: string[];
  states?: TileState[];
  wordLength: number;
  isCurrent?: boolean;
};

const TileRow = ({ letters, states = [], wordLength, isCurrent }: Props) => {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${wordLength}, 1fr)`,
  };

  const tiles = Array.from({ length: wordLength }, (_, idx) => {
    const letter = letters[idx] ?? '';
    const state = states[idx] ?? 'empty';
    const className = `tile ${state} ${isCurrent && letter ? 'active' : ''}`;
    return (
      <div key={idx} className={className}>
        {letter}
      </div>
    );
  });

  return (
    <div className="tile-row" style={gridStyle}>
      {tiles}
    </div>
  );
};

export default TileRow;
