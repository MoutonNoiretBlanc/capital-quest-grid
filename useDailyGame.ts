import { useCallback, useEffect, useMemo, useState } from "react";
import { generateDailyGrid, getTodayDateString, findCapital, rarityScore } from "@/lib/dailyGrid";
import { SCORING } from "@/lib/scoring";
import type { CellState, GameState } from "@/types/capital";

const STORAGE_PREFIX = "capital-grid-";

function emptyCells(): CellState[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => ({ status: "empty" as const }))
  );
}

function loadState(date: string): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + date);
    if (raw) return JSON.parse(raw) as GameState;
  } catch {
    // ignore
  }
  return {
    date,
    cells: emptyCells(),
    lives: 3,
    score: 0,
    status: "playing",
    usedCapitals: [],
  };
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_PREFIX + state.date, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useDailyGame() {
  const date = useMemo(() => getTodayDateString(), []);
  const grid = useMemo(() => generateDailyGrid(date), [date]);
  const [state, setState] = useState<GameState>(() => loadState(date));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const submitAnswer = useCallback(
    (
      row: number,
      col: number,
      capitalName: string
    ): { ok: boolean; message: string; points?: number; bonus?: number } => {
      if (state.status !== "playing") {
        return { ok: false, message: "Partie terminée" };
      }
      if (state.cells[row][col].status === "filled") {
        return { ok: false, message: "Case déjà remplie" };
      }
      const capital = findCapital(capitalName);
      if (!capital) {
        return { ok: false, message: "Capitale inconnue" };
      }
      if (state.usedCapitals.includes(capital.name)) {
        // Treat as wrong: lose a life
        setState((s) => {
          const lives = s.lives - 1;
          return {
            ...s,
            lives,
            status: lives <= 0 ? "lost" : s.status,
          };
        });
        return { ok: false, message: `${capital.name} a déjà été utilisée` };
      }
      const rowCond = grid.rows[row];
      const colCond = grid.cols[col];
      const valid = rowCond.test(capital) && colCond.test(capital);
      if (!valid) {
        setState((s) => {
          const lives = s.lives - 1;
          return {
            ...s,
            lives,
            status: lives <= 0 ? "lost" : s.status,
          };
        });
        return {
          ok: false,
          message: `${capital.name} ne satisfait pas les deux conditions`,
        };
      }
      const points = rarityScore(capital);

      // Nouvelle grille après placement (calculée ici pour connaître les bonus)
      const nextCells = state.cells.map((r) => r.map((c) => ({ ...c })));
      nextCells[row][col] = {
        status: "filled",
        capitalName: capital.name,
        country: capital.country,
        score: points,
        continent: capital.continent,
      };
      const rowDone = nextCells[row].every((c) => c.status === "filled");
      const colDone = nextCells.every((r) => r[col].status === "filled");
      const filledCount = nextCells.flat().filter((c) => c.status === "filled").length;
      const won = filledCount === 9;

      let bonus = 0;
      const parts: string[] = [];
      if (rowDone) {
        bonus += SCORING.LINE_BONUS;
        parts.push(`ligne +${SCORING.LINE_BONUS}`);
      }
      if (colDone) {
        bonus += SCORING.LINE_BONUS;
        parts.push(`colonne +${SCORING.LINE_BONUS}`);
      }
      if (won) {
        bonus += SCORING.GRID_BONUS;
        parts.push(`grille +${SCORING.GRID_BONUS}`);
        const lifeBonus = state.lives * SCORING.LIFE_BONUS;
        if (lifeBonus > 0) {
          bonus += lifeBonus;
          parts.push(`vies +${lifeBonus}`);
        }
      }

      setState((s) => ({
        ...s,
        cells: nextCells,
        score: s.score + points + bonus,
        usedCapitals: [...s.usedCapitals, capital.name],
        status: won ? "won" : s.status,
      }));
      const message =
        `+${points} pts` + (parts.length ? ` · bonus : ${parts.join(", ")}` : "");
      return { ok: true, message, points, bonus };
    },
    [grid, state]
  );

  const reset = useCallback(() => {
    const fresh: GameState = {
      date,
      cells: emptyCells(),
      lives: 3,
      score: 0,
      status: "playing",
      usedCapitals: [],
    };
    setState(fresh);
    saveState(fresh);
  }, [date]);

  return { grid, state, submitAnswer, reset };
}
