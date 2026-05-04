import { useEffect, useState } from "react";
import { GameHeader } from "@/components/game/GameHeader";
import { Board } from "@/components/game/Board";
import { EndGameDialog } from "@/components/game/EndGameDialog";
import { useDailyGame } from "@/hooks/useDailyGame";
import { Button } from "@/components/ui/button";
import { RotateCcw, Info } from "lucide-react";

const Index = () => {
  const { grid, state, submitAnswer, reset } = useDailyGame();
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (state.status !== "playing") {
      const t = setTimeout(() => setEndOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [state.status]);

  useEffect(() => {
    document.title = "Capital·Grid — Jeu quotidien des capitales";
    const desc = "Devinez chaque jour 9 capitales du monde dans une grille 3×3 selon des conditions croisées. Score, vies et défi quotidien.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GameHeader
        lives={state.lives}
        maxLives={3}
        score={state.score}
        date={grid.date}
      />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:py-16 text-left">
        <div className="mb-10 flex items-start justify-between gap-6 sm:mb-14">
          <div className="max-w-xl">
            <h2 className="font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
              Trouvez la capitale à chaque intersection.
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm font-light leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
              <span>
                Chaque capitale doit satisfaire à la fois la condition de sa ligne
                et celle de sa colonne. Plus la ville est petite, plus elle rapporte.
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              setEndOpen(false);
            }}
            className="rounded-sm font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
            Réinit.
          </Button>
        </div>

        <Board grid={grid} state={state} onSubmit={submitAnswer} />

        <footer className="mt-20 border-t border-border/60 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Une nouvelle grille chaque jour · {grid.date}
        </footer>
      </main>

      <EndGameDialog
        state={state}
        open={endOpen}
        onOpenChange={setEndOpen}
        onReset={() => {
          reset();
          setEndOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
