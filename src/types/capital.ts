export type Continent = "Europe" | "Asie" | "Afrique" | "Amérique" | "Océanie";
export type Religion = "Chrétien" | "Musulman" | "Bouddhiste" | "Hindou";

export interface Capital {
  name: string;
  country: string;
  continent: Continent;
  religion: Religion;
  foundedYear: number;
  hasMetro: boolean;
  population: number;
}

export type ConditionType =
  | { kind: "continent"; value: Continent }
  | { kind: "religion"; value: Religion }
  | { kind: "metro"; value: boolean }
  | { kind: "foundedBefore"; year: number }
  | { kind: "foundedAfter"; year: number };

export interface Condition {
  id: string;
  label: string;
  test: (c: Capital) => boolean;
}

export interface DailyGrid {
  date: string;
  rows: Condition[];
  cols: Condition[];
}

export type CellStatus = "empty" | "filled";

export interface CellState {
  status: CellStatus;
  capitalName?: string;
  country?: string;
  score?: number;
  continent?: Continent;
}

export interface GameState {
  date: string;
  cells: CellState[][];
  lives: number;
  score: number;
  status: "playing" | "won" | "lost";
  usedCapitals: string[];
}
