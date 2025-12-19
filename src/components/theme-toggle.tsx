import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore } from "@/stores/theme";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themeOrder: Theme[] = ["light", "dark", "system"];
const themeLabels: Record<Theme, string> = {
  light: "浅色",
  dark: "深色",
  system: "系统",
};

interface ThemeToggleProps {
  compact?: boolean;
}

export default function ThemeToggle({ compact }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const icon = {
    light: <Sun className={cn(compact ? "h-6 w-6" : "h-5 w-5")} />,
    dark: <Moon className={cn(compact ? "h-6 w-6" : "h-5 w-5")} />,
    system: <Monitor className={cn(compact ? "h-6 w-6" : "h-5 w-5")} />,
  }[theme];

  if (compact) {
    return (
      <button
        onClick={cycleTheme}
        className="flex flex-col items-center justify-center text-muted-foreground active:text-primary transition-colors"
        aria-label="Toggle theme"
        title={`当前: ${themeLabels[theme]}`}
      >
        {icon}
        <span className="text-xs mt-1 font-medium">{themeLabels[theme]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-sm"
      aria-label="Toggle theme"
      title={`当前: ${themeLabels[theme]}`}
    >
      {icon}
      <span className="text-muted-foreground">{themeLabels[theme]}</span>
    </button>
  );
}
