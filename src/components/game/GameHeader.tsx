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
    <header className="w-full border-b border-border/70 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl font-600 tracking-tight sm:text-[28px]">
            Capital<span className="text-foreground/30">·</span>Grid
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {date}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5" aria-label={`${lives} vies restantes`}>
            {Array.from({ length: maxLives }).map((_, i) => {
              const active = i < lives;
              return (
                <Heart
                  key={i}
                  strokeWidth={1.5}
                  className={cn(
                    "h-4 w-4 transition-all",
                    active
                      ? "fill-destructive text-destructive"
                      : "text-muted-foreground/25"
                  )}
                />
              );
            })}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Score
            </span>
            <span className="font-display text-xl font-500 tabular-nums">
              {score}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
