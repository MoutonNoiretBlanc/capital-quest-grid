import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Skull, Share2 } from "lucide-react";
import type { GameState } from "@/types/capital";
import { toast } from "sonner";

interface EndGameDialogProps {
  state: GameState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function EndGameDialog({ state, open, onOpenChange, onReset }: EndGameDialogProps) {
  const won = state.status === "won";

  const handleShare = () => {
    const grid = state.cells
      .map((row) =>
        row
          .map((c) => (c.status === "filled" ? "🟧" : "⬜"))
          .join("")
      )
      .join("\n");
    const text = `Capital·Grid ${state.date}\n${won ? "✅" : "💀"} Score : ${state.score} pts\n\n${grid}`;
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Résultat copié !"))
      .catch(() => toast.error("Impossible de copier"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-copper text-primary-foreground">
            {won ? <Trophy className="h-7 w-7" /> : <Skull className="h-7 w-7" />}
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            {won ? "Bravo, atlas complet !" : "Partie terminée"}
          </DialogTitle>
          <DialogDescription className="text-center font-mono text-xs uppercase tracking-wider">
            {state.date}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-center justify-center gap-6 rounded-sm border border-border bg-secondary/40 py-4">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Score
            </p>
            <p className="font-display text-3xl font-700 tabular-nums">{state.score}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Cases
            </p>
            <p className="font-display text-3xl font-700 tabular-nums">
              {state.cells.flat().filter((c) => c.status === "filled").length}/9
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {state.cells.flat().map((c, i) => (
            <div
              key={i}
              className={
                "flex aspect-square items-center justify-center rounded-sm text-[10px] " +
                (c.status === "filled"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground")
              }
            >
              {c.status === "filled" ? "✓" : "·"}
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button onClick={onReset} className="flex-1 bg-gradient-copper">
            Rejouer
          </Button>
        </div>
        <p className="text-center font-mono text-[11px] text-muted-foreground">
          Une nouvelle grille apparaît chaque jour à minuit.
        </p>
      </DialogContent>
    </Dialog>
  );
}
