import { useState } from "react";
import { Search } from "lucide-react";
import { searchCapitals } from "@/lib/dailyGrid";
import type { Capital } from "@/types/capital";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CapitalSearchProps {
  onSelect: (name: string) => void;
  excluded?: string[];
  autoFocus?: boolean;
}

export function CapitalSearch({ onSelect, excluded = [], autoFocus }: CapitalSearchProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results: Capital[] = query.trim().length > 0 ? searchCapitals(query, 8) : [];

  const handleSelect = (cap: Capital) => {
    setQuery("");
    onSelect(cap.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      handleSelect(results[active]);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <Input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Tape une capitale…"
          className="rounded-sm border-border/80 pl-9 font-sans text-sm"
        />
      </div>
      {results.length > 0 && (
        <ul className="mt-2 max-h-64 overflow-y-auto rounded-sm border border-border/80 bg-popover">
          {results.map((cap, i) => {
            const isUsed = excluded.includes(cap.name);
            return (
              <li key={cap.name}>
                <button
                  type="button"
                  disabled={isUsed}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => handleSelect(cap)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                    i === active && !isUsed && "bg-secondary",
                    isUsed && "cursor-not-allowed opacity-40"
                  )}
                >
                  <span className="font-display font-600">{cap.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {cap.country}
                    {isUsed && " · utilisée"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {query.trim() && results.length === 0 && (
        <p className="mt-2 px-1 font-mono text-xs text-muted-foreground">
          Aucune capitale trouvée.
        </p>
      )}
    </div>
  );
}
