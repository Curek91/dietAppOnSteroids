import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  hue?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl"
};

export function Avatar({ name, hue = 24, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  const bg = `linear-gradient(135deg, hsl(${hue} 85% 70%), hsl(${(hue + 25) % 360} 85% 55%))`;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-semibold shadow-soft ring-2 ring-white/80",
        sizeMap[size],
        className
      )}
      style={{ background: bg }}
      aria-label={name}
    >
      {initials || "?"}
    </div>
  );
}
