export const COLORS = [
  "hsl(342, 70%, 50%)",
  "hsl(162, 70%, 50%)",
  "hsl(42, 70%, 50%)",
  "hsl(222, 70%, 50%)",
  "hsl(282, 70%, 50%)",
] as const

export function getColor(i: number) {
  return COLORS[i % COLORS.length]
}
