import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  lives: number;
  maxLives: number;
  score: number;
  date: string;
}

export function GameHeader({ lives, maxLives, score, date }: GameHeaderProps) {
  return (
    <header className="w-full border-b border-border bg-card/60 backdrop-blur-sm shadow-paper">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
            Capital<span className="text-primary">·</span>Grid
          </h1>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {date}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5" aria-label={`${lives} vies restantes`}>
            {Array.from({ length: maxLives }).map((_, i) => {
              const active = i < lives;
              return (
                <Heart
                  key={i}
                  className={cn(
                    "h-5 w-5 transition-all",
                    active
                      ? "fill-destructive text-destructive"
                      : "text-muted-foreground/30"
                  )}
                />
              );
            })}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Score
            </span>
            <span className="font-display text-2xl font-700 tabular-nums">
              {score}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
