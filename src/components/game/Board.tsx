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

      // Lasers strike INSIDE the cell, 6px down and 6px right from top-left corner
      const OFFSET = 6;
      const cellLeft = cellBox.left - wrapBox.left;
      const cellTop = cellBox.top - wrapBox.top;

      // Vertical laser: from column header bottom down to impact point inside cell
      const vLeft = cellLeft + OFFSET;
      const vTop = colBox.bottom - wrapBox.top;
      const vLength = cellTop + OFFSET - vTop;

      // Horizontal laser: from row header right to impact point inside cell
      const hTop = cellTop + OFFSET;
      const hLeft = rowBox.right - wrapBox.left;
      const hLength = cellLeft + OFFSET - hLeft;

      // Retro orange for validation
      const color = "16 79% 53%";
      const id1 = ++laserIdRef.current;
      const id2 = ++laserIdRef.current;
      const newLasers: Laser[] = [
        {
          id: id1,
          axis: "v",
          left: vLeft,
          top: vTop,
          length: vLength,
          color,
        },
        {
          id: id2,
          axis: "h",
          left: hLeft,
          top: hTop,
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

  // Detect completed rows / cols
  const rowComplete = [0, 1, 2].map((r) =>
    state.cells[r].every((c) => c.status === "filled")
  );
  const colComplete = [0, 1, 2].map((c) =>
    state.cells.every((row) => row[c].status === "filled")
  );

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
            data-complete={colComplete[i] ? "true" : "false"}
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
            rowComplete={rowComplete[r]}
            colComplete={colComplete}
          />
        ))}
      </div>

      {/* Laser overlay — SVG beams with gaussian blur halo + dash trail */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="laser-grad-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(16 79% 53%)" stopOpacity="0" />
            <stop offset="70%" stopColor="hsl(16 90% 60%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff1e8" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="laser-grad-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(16 79% 53%)" stopOpacity="0" />
            <stop offset="70%" stopColor="hsl(16 90% 60%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff1e8" stopOpacity="1" />
          </linearGradient>
        </defs>
        {lasers.map((l) => {
          const len = Math.max(0, Math.abs(l.length));
          if (l.axis === "h") {
            const x1 = l.left;
            const x2 = l.left + l.length;
            return (
              <line
                key={l.id}
                className="cg-laser-line"
                x1={x1}
                y1={l.top}
                x2={x2}
                y2={l.top}
                stroke="url(#laser-grad-h)"
                strokeWidth={1.5}
                strokeLinecap="round"
                filter="url(#laser-glow)"
                style={{
                  strokeDasharray: `${len} ${len}`,
                  strokeDashoffset: len,
                  animation: `laser-dash 0.2s cubic-bezier(0.2,0,0.2,1) forwards, laser-fade-out 0.6s ease-out 0.2s forwards`,
                }}
              />
            );
          }
          const y1 = l.top;
          const y2 = l.top + l.length;
          return (
            <line
              key={l.id}
              className="cg-laser-line"
              x1={l.left}
              y1={y1}
              x2={l.left}
              y2={y2}
              stroke="url(#laser-grad-v)"
              strokeWidth={1.5}
              strokeLinecap="round"
              filter="url(#laser-glow)"
              style={{
                strokeDasharray: `${len} ${len}`,
                strokeDashoffset: len,
                animation: `laser-dash 0.2s cubic-bezier(0.2,0,0.2,1) forwards, laser-fade-out 0.6s ease-out 0.2s forwards`,
              }}
            />
          );
        })}
      </svg>
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
  rowComplete,
  colComplete,
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
  rowComplete: boolean;
  colComplete: boolean[];
}) {
  return (
    <>
      <div
        ref={(el) => (rowHeadRefs.current[row] = el)}
        data-axis="row"
        data-complete={rowComplete ? "true" : "false"}
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
          lineComplete={rowComplete || colComplete[c]}
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

