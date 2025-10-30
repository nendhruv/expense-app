export function formatINRPaise(paise: number): string {
  const rupees = paise / 100;
  return `${formatNumberINR(rupees)}`;
}

export function formatNumberINR(n: number): string {
  // en-IN locale grouping
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}



