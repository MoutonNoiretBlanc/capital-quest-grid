import { useState } from "react";
import { Plus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CapitalSearch } from "./CapitalSearch";
import { cn } from "@/lib/utils";
import type { CellState, Condition } from "@/types/capital";
import { toast } from "sonner";

interface GridCellProps {
  cell: CellState;
  rowCond: Condition;
  colCond: Condition;
  disabled: boolean;
  usedCapitals: string[];
  onSubmit: (name: string) => { ok: boolean; message: string; points?: number };
}

export function GridCell({
  cell,
  rowCond,
  colCond,
  disabled,
  usedCapitals,
  onSubmit,
}: GridCellProps) {
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSelect = (name: string) => {
    const result = onSubmit(name);
    if (result.ok) {
      toast.success(`${name} validée`, { description: result.message });
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
      <div className="aspect-square animate-flip-in rounded-sm border border-border bg-gradient-paper p-2 shadow-paper sm:p-3">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Check className="mb-1 h-4 w-4 text-success" />
          <p className="font-display text-sm font-600 leading-tight text-foreground sm:text-base">
            {cell.capitalName}
          </p>
          <p className="mt-1 font-mono text-[10px] text-primary sm:text-xs">
            +{cell.score} pts
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "group aspect-square rounded-sm border border-dashed border-border bg-card/40 transition-all",
          "hover:border-primary hover:bg-card hover:shadow-paper",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          shake && "animate-shake border-destructive"
        )}
        aria-label={`Saisir capitale pour ${rowCond.label} et ${colCond.label}`}
      >
        <Plus className="mx-auto h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Quelle capitale ?
            </DialogTitle>
            <DialogDescription className="font-mono text-xs uppercase tracking-wider">
              {rowCond.label} <span className="text-primary">×</span> {colCond.label}
            </DialogDescription>
          </DialogHeader>
          <CapitalSearch
            autoFocus
            onSelect={handleSelect}
            excluded={usedCapitals}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
