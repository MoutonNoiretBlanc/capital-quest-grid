import { forwardRef, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CapitalSearch } from "./CapitalSearch";
import { cn } from "@/lib/utils";
import { continentVar } from "@/lib/continent";
import { flagImgSrc } from "@/lib/countryFlags";
import type { CellState, Condition, Continent } from "@/types/capital";
import { toast } from "sonner";

interface GridCellProps {
  cell: CellState;
  rowCond: Condition;
  colCond: Condition;
  disabled: boolean;
  usedCapitals: string[];
  onSubmit: (name: string) => { ok: boolean; message: string; points?: number };
  onValidated?: (continent: Continent) => void;
}

export const GridCell = forwardRef<HTMLDivElement, GridCellProps>(function GridCell(
  { cell, rowCond, colCond, disabled, usedCapitals, onSubmit, onValidated },
  ref
) {
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSelect = (name: string) => {
    const result = onSubmit(name);
    if (result.ok) {
      // Find the continent from the just-submitted capital name via the cell update
      // We rely on onValidated via the parent capturing continent through state — but here
      // we pass a placeholder; Board will read the updated cell state after re-render.
      // Simpler: fire onValidated immediately using a lookup.
      // We import findCapital to get continent.
      import("@/lib/dailyGrid").then(({ findCapital }) => {
        const cap = findCapital(name);
        if (cap) onValidated?.(cap.continent);
      });
      toast.success(`${name}`, {
        description: result.message,
        duration: 2200,
      });
      setOpen(false);
    } else {
      toast.error(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setOpen(false);
    }
  };

  if (cell.status === "filled") {
    return (
      <div
        ref={ref}
        data-filled="true"
        style={
          {
            ["--cell-accent" as string]: `hsl(${continentVar(cell.continent)})`,
          } as React.CSSProperties
        }
        className="cg-cell relative aspect-square animate-fade-up"
      >
        {/* Validation glow only — text & score are clean */}

        <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-1 px-3 text-center">
          <p className="font-display text-sm font-semibold leading-tight text-foreground sm:text-[15px]">
            {cell.capitalName}
          </p>
          <p className="flex items-center justify-center gap-1.5 text-[10px] leading-tight text-muted-foreground/80 sm:text-[11px]">
            <span>{cell.country}</span>
            {flagImgSrc(cell.country) && (
              <img
                src={flagImgSrc(cell.country)}
                srcSet={`${flagImgSrc(cell.country, 20)} 1x, ${flagImgSrc(cell.country, 40)} 2x`}
                width={16}
                height={12}
                alt=""
                aria-hidden
                className="inline-block h-3 w-auto rounded-[2px] shadow-[0_0_0_1px_hsl(var(--border))]"
                loading="lazy"
              />
            )}
          </p>
        </div>

        <span className="cg-score">+{cell.score} pts</span>
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          "cg-cell aspect-square",
          shake && "animate-shake",
          disabled && "opacity-50"
        )}
      >
        <span className="cg-hover-circle" aria-hidden />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-label={`Saisir capitale pour ${rowCond.label} et ${colCond.label}`}
          className={cn(
            "relative z-[1] flex h-full w-full items-center justify-center",
            "text-muted-foreground/50 transition-colors duration-300",
            "hover:text-foreground/70",
            "focus-visible:outline-none focus-visible:text-foreground/80",
            "disabled:cursor-not-allowed"
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-sm border-border/80 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-medium">
              Quelle capitale ?
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px] uppercase tracking-widest">
              {rowCond.label} <span className="text-foreground/40">×</span>{" "}
              {colCond.label}
            </DialogDescription>
          </DialogHeader>
          <CapitalSearch autoFocus onSelect={handleSelect} excluded={usedCapitals} />
        </DialogContent>
      </Dialog>
    </>
  );
});
