import type { Capital } from "@/types/capital";

/**
 * Barème statique de Capital·Grid.
 * Tous les montants sont modifiables ici, au même endroit.
 */
export const SCORING = {
  /** Points d'une capitale très peu peuplée (la plus petite du jeu). */
  MAX_CITY_POINTS: 100,
  /** Points d'une capitale très peuplée (la plus grande du jeu). */
  MIN_CITY_POINTS: 20,
  /** Bonus par ligne ou colonne complétée (une case peut en déclencher deux). */
  LINE_BONUS: 50,
  /** Bonus quand les 9 cases sont remplies. */
  GRID_BONUS: 200,
  /** Bonus par vie restante, uniquement si la grille est complète. */
  LIFE_BONUS: 25,
} as const;

/**
 * Points d'une capitale : échelle logarithmique de la population,
 * entre MIN_CITY_POINTS (plus grande ville) et MAX_CITY_POINTS (plus petite).
 * Si la capitale a un champ `points` (venu de l'Excel), il est utilisé tel quel.
 */
export function capitalPoints(capital: Capital, all: Capital[]): number {
  if (typeof capital.points === "number") return capital.points;
  const logs = all.map((c) => Math.log(c.population));
  const lo = Math.min(...logs);
  const hi = Math.max(...logs);
  if (hi === lo) return SCORING.MAX_CITY_POINTS;
  const t = (Math.log(capital.population) - lo) / (hi - lo); // 0 = petite, 1 = grande
  const pts =
    SCORING.MAX_CITY_POINTS - t * (SCORING.MAX_CITY_POINTS - SCORING.MIN_CITY_POINTS);
  return Math.round(pts);
}
