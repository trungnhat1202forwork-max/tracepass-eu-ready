import { cn } from "@/lib/utils";

const SIZE = 21;

function isDark(x: number, y: number) {
  const inFinder = (fx: number, fy: number) =>
    x >= fx &&
    x < fx + 7 &&
    y >= fy &&
    y < fy + 7 &&
    !(
      x > fx &&
      x < fx + 6 &&
      y > fy &&
      y < fy + 6 &&
      !(x > fx + 1 && x < fx + 5 && y > fy + 1 && y < fy + 5)
    );
  if (inFinder(0, 0) || inFinder(SIZE - 7, 0) || inFinder(0, SIZE - 7)) return true;
  const seed = (x * 73856093) ^ (y * 19349663);
  return ((seed >> 3) & 7) > 3;
}

export function QrVisual({ className }: { className?: string | undefined }) {
  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isDark(x, y)) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
    }
  }
  return (
    <svg
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      className={cn("rounded-lg bg-card fill-primary", className)}
      role="img"
      aria-label="Mã QR của DPP"
    >
      {cells}
    </svg>
  );
}
