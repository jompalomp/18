export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </span>
  );
}
