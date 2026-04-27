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

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-700 leading-tight sm:text-3xl">
              Trouvez la capitale à chaque intersection.
            </h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
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
            className="font-mono text-xs uppercase tracking-wider"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Réinit.
          </Button>
        </div>

        <Board grid={grid} state={state} onSubmit={submitAnswer} />

        <footer className="mt-12 border-t border-border pt-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
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
