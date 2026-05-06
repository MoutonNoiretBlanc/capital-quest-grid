import { useCallback, useEffect, useRef, useState } from "react";
import { GridCell } from "./GridCell";
import { continentVar } from "@/lib/continent";
import type { Continent, DailyGrid, GameState } from "@/types/capital";

interface BoardProps {
  grid: DailyGrid;
  state: GameState;
  onSubmit: (
    row: number,
    col: number,
    name: string
  ) => { ok: boolean; message: string; points?: number };
}

interface Laser {
  id: number;
  axis: "h" | "v";
  left: number;
  top: number;
  length: number;
  color: string;
}

export function Board({ grid, state, onSubmit }: BoardProps) {
  const disabled = state.status !== "playing";
  const wrapRef = useRef<HTMLDivElement>(null);
  const colHeadRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowHeadRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([[], [], []]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const laserIdRef = useRef(0);

  const fireLasers = useCallback(
    (row: number, col: number, continent: Continent) => {
      const wrap = wrapRef.current;
      const cell = cellRefs.current[row]?.[col];
      const colHead = colHeadRefs.current[col];
      const rowHead = rowHeadRefs.current[row];
      if (!wrap || !cell || !colHead || !rowHead) return;
      const wrapBox = wrap.getBoundingClientRect();
      const cellBox = cell.getBoundingClientRect();
      const colBox = colHead.getBoundingClientRect();
      const rowBox = rowHead.getBoundingClientRect();

      // Vertical laser: from column header bottom to cell top edge
      const vTop = colBox.bottom - wrapBox.top;
      const vBottom = cellBox.top - wrapBox.top;
      const vLeft = cellBox.left - wrapBox.left + cellBox.width / 2;
      const vLength = vBottom - vTop;

      // Horizontal laser: from row header right to cell left edge
      const hLeft = rowBox.right - wrapBox.left;
      const hRight = cellBox.left - wrapBox.left;
      const hTop = cellBox.top - wrapBox.top + cellBox.height / 2;
      const hLength = hRight - hLeft;

      // Emerald green for validation
      const color = "152 76% 44%";
      const id1 = ++laserIdRef.current;
      const id2 = ++laserIdRef.current;
      const newLasers: Laser[] = [
        {
          id: id1,
          axis: "v",
          left: ox,
          top: colTargetY,
          length: vLength,
          color,
        },
        {
          id: id2,
          axis: "h",
          left: rowTargetX,
          top: oy,
          length: hLength,
          color,
        },
      ];
      setLasers((l) => [...l, ...newLasers]);
      setTimeout(() => {
        setLasers((l) => l.filter((x) => x.id !== id1 && x.id !== id2));
      }, 1500);
    },
    []
  );

  // Cleanup lasers on unmount
  useEffect(() => () => setLasers([]), []);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-2xl">
      <div className="grid grid-cols-[minmax(90px,0.9fr)_repeat(3,minmax(0,1fr))] gap-4 sm:gap-5">
        {/* Top-left empty */}
        <div />
        {/* Column headers */}
        {grid.cols.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => (colHeadRefs.current[i] = el)}
            data-axis="col"
            className="cg-head"
          >
            <span className="font-display text-[11px] font-medium uppercase leading-snug tracking-wide text-foreground/80 sm:text-xs">
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
            colHeadRefs={colHeadRefs}
            rowHeadRefs={rowHeadRefs}
            cellRefs={cellRefs}
            onValidated={fireLasers}
          />
        ))}
      </div>

      {/* Laser overlay */}
      <div className="pointer-events-none absolute inset-0">
        {lasers.map((l) =>
          l.axis === "h" ? (
            <span
              key={l.id}
              className="cg-laser cg-laser--h"
              style={
                {
                  left: `${l.left}px`,
                  top: `${l.top}px`,
                  width: `${Math.max(0, l.length)}px`,
                  ["--laser-color" as string]: l.color,
                } as React.CSSProperties
              }
            />
          ) : (
            <span
              key={l.id}
              className="cg-laser cg-laser--v"
              style={
                {
                  left: `${l.left}px`,
                  top: `${l.top}px`,
                  height: `${Math.max(0, l.length)}px`,
                  ["--laser-color" as string]: l.color,
                } as React.CSSProperties
              }
            />
          )
        )}
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
  colHeadRefs,
  rowHeadRefs,
  cellRefs,
  onValidated,
}: {
  rowCond: { id: string; label: string };
  row: number;
  grid: DailyGrid;
  state: GameState;
  disabled: boolean;
  onSubmit: BoardProps["onSubmit"];
  colHeadRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  rowHeadRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  cellRefs: React.MutableRefObject<(HTMLDivElement | null)[][]>;
  onValidated: (row: number, col: number, continent: Continent) => void;
}) {
  return (
    <>
      <div
        ref={(el) => (rowHeadRefs.current[row] = el)}
        data-axis="row"
        className="cg-head"
      >
        <span className="font-display text-[11px] font-medium uppercase leading-snug tracking-wide text-foreground/80 sm:text-xs">
          {rowCond.label}
        </span>
      </div>
      {grid.cols.map((colCond, c) => (
        <GridCell
          key={`${row}-${c}`}
          ref={(el) => {
            if (!cellRefs.current[row]) cellRefs.current[row] = [];
            cellRefs.current[row][c] = el;
          }}
          cell={state.cells[row][c]}
          rowCond={grid.rows[row]}
          colCond={colCond}
          disabled={disabled}
          usedCapitals={state.usedCapitals}
          onSubmit={(name) => {
            const result = onSubmit(row, c, name);
            return result;
          }}
          onValidated={(continent) => onValidated(row, c, continent)}
        />
      ))}
    </>
  );
}
