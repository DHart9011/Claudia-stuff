export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function dollarsToCents(dollars: string | number): number {
  const value = typeof dollars === "string" ? Number(dollars) : dollars;
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid dollar amount");
  }
  return Math.round(value * 100);
}
