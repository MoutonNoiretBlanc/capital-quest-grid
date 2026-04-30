import type { Continent } from "@/types/capital";

export function continentDotClass(c?: Continent): string {
  switch (c) {
    case "Europe": return "dot-europe";
    case "Asie": return "dot-asia";
    case "Afrique": return "dot-africa";
    case "Amérique": return "dot-america";
    case "Océanie": return "dot-oceania";
    default: return "dot-europe";
  }
}

export function continentVar(c?: Continent): string {
  switch (c) {
    case "Europe": return "var(--c-europe)";
    case "Asie": return "var(--c-asia)";
    case "Afrique": return "var(--c-africa)";
    case "Amérique": return "var(--c-america)";
    case "Océanie": return "var(--c-oceania)";
    default: return "var(--primary-glow)";
  }
}
