import { GridCell } from "./GridCell";
import type { DailyGrid, GameState } from "@/types/capital";

interface BoardProps {
  grid: DailyGrid;
  state: GameState;
  onSubmit: (
    row: number,
    col: number,
    name: string
  ) => { ok: boolean; message: string; points?: number };
}

export function Board({ grid, state, onSubmit }: BoardProps) {
  const disabled = state.status !== "playing";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="grid grid-cols-[minmax(80px,1fr)_repeat(3,minmax(0,2fr))] gap-2 sm:gap-3">
        {/* Top-left empty */}
        <div />
        {/* Column headers */}
        {grid.cols.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-center rounded-sm border border-border bg-accent/90 px-2 py-3 text-center shadow-paper"
          >
            <span className="font-display text-xs font-600 leading-tight text-accent-foreground sm:text-sm">
              {c.label}
            </span>
          </div>
        ))}

        {grid.rows.map((rowCond, r) => (
          <RowFragment
            key={rowCond.id}
            rowCond={rowCond}
            row={r}
            grid={grid}
            state={state}
            disabled={disabled}
            onSubmit={onSubmit}
          />
        ))}
      </div>
    </div>
  );
}

function RowFragment({
  rowCond,
  row,
  grid,
  state,
  disabled,
  onSubmit,
}: {
  rowCond: { id: string; label: string };
  row: number;
  grid: DailyGrid;
  state: GameState;
  disabled: boolean;
  onSubmit: BoardProps["onSubmit"];
}) {
  return (
    <>
      <div className="flex items-center justify-center rounded-sm border border-border bg-accent/90 px-2 py-3 text-center shadow-paper">
        <span className="font-display text-xs font-600 leading-tight text-accent-foreground sm:text-sm">
          {rowCond.label}
        </span>
      </div>
      {grid.cols.map((colCond, c) => (
        <GridCell
          key={`${row}-${c}`}
          cell={state.cells[row][c]}
          rowCond={grid.rows[row]}
          colCond={colCond}
          disabled={disabled}
          usedCapitals={state.usedCapitals}
          onSubmit={(name) => onSubmit(row, c, name)}
        />
      ))}
    </>
  );
}
