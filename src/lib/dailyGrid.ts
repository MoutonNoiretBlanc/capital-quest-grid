import capitalsData from "@/data/capitals.json";
import type { Capital, Condition, DailyGrid } from "@/types/capital";

export const CAPITALS = capitalsData as Capital[];
export const MAX_POPULATION = Math.max(...CAPITALS.map((c) => c.population));

// Mulberry32 PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromDate(dateStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildAllConditions(): Condition[] {
  const conds: Condition[] = [];
  const continents = ["Europe", "Asie", "Afrique", "Amérique", "Océanie"] as const;
  for (const cont of continents) {
    conds.push({
      id: `cont-${cont}`,
      label: `En ${cont}`,
      test: (c) => c.continent === cont,
    });
  }
  const religions = ["Chrétien", "Musulman", "Bouddhiste", "Hindou"] as const;
  for (const rel of religions) {
    conds.push({
      id: `rel-${rel}`,
      label: `Pays ${rel.toLowerCase()}`,
      test: (c) => c.religion === rel,
    });
  }
  conds.push({
    id: "metro-yes",
    label: "Possède un métro",
    test: (c) => c.hasMetro,
  });
  conds.push({
    id: "metro-no",
    label: "Sans métro",
    test: (c) => !c.hasMetro,
  });
  const foundationYears = [1000, 1500, 1800];
  for (const y of foundationYears) {
    conds.push({
      id: `before-${y}`,
      label: `Fondée avant ${y}`,
      test: (c) => c.foundedYear < y,
    });
    conds.push({
      id: `after-${y}`,
      label: `Fondée après ${y}`,
      test: (c) => c.foundedYear > y,
    });
  }
  return conds;
}

const ALL_CONDITIONS = buildAllConditions();

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function intersectionHasAnswer(rowCond: Condition, colCond: Condition): boolean {
  return CAPITALS.some((c) => rowCond.test(c) && colCond.test(c));
}

function isValidGrid(rows: Condition[], cols: Condition[]): boolean {
  for (const r of rows) for (const c of cols) {
    if (!intersectionHasAnswer(r, c)) return false;
  }
  return true;
}

export function generateDailyGrid(dateStr: string): DailyGrid {
  const seed = seedFromDate(dateStr);
  const rand = mulberry32(seed);

  // Try up to 200 random samples to find a valid 3x3
  for (let attempt = 0; attempt < 200; attempt++) {
    const shuffled = shuffle(ALL_CONDITIONS, rand);
    const rows = shuffled.slice(0, 3);
    const cols = shuffled.slice(3, 6);
    // Ensure rows and cols are not identical conditions (guaranteed by slice)
    if (isValidGrid(rows, cols)) {
      return { date: dateStr, rows, cols };
    }
  }
  // Fallback: deterministic safe grid
  const safeRows = [
    ALL_CONDITIONS.find((c) => c.id === "cont-Europe")!,
    ALL_CONDITIONS.find((c) => c.id === "cont-Asie")!,
    ALL_CONDITIONS.find((c) => c.id === "cont-Amérique")!,
  ];
  const safeCols = [
    ALL_CONDITIONS.find((c) => c.id === "metro-yes")!,
    ALL_CONDITIONS.find((c) => c.id === "rel-Chrétien")!,
    ALL_CONDITIONS.find((c) => c.id === "before-1800")!,
  ];
  return { date: dateStr, rows: safeRows, cols: safeCols };
}

export function findCapital(name: string): Capital | undefined {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const target = norm(name);
  return CAPITALS.find((c) => norm(c.name) === target);
}

export function searchCapitals(query: string, limit = 8): Capital[] {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = norm(query.trim());
  if (!q) return [];
  return CAPITALS.filter((c) => norm(c.name).includes(q)).slice(0, limit);
}

export function rarityScore(capital: Capital): number {
  return Math.round((1 - capital.population / MAX_POPULATION) * 100);
}
