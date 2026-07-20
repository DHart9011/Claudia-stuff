export function Avatar({
  emoji,
  color,
  size = "lg",
}: {
  emoji: string;
  color: string;
  size?: "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    md: "h-14 w-14 text-2xl",
    lg: "h-24 w-24 text-4xl",
    xl: "h-32 w-32 text-6xl",
  }[size];

  return (
    <div
      className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-full shadow-inner`}
      style={{ backgroundColor: color }}
    >
      <span>{emoji}</span>
    </div>
  );
}
