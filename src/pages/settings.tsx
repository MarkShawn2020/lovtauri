import { Moon, Sun, Monitor, ChevronRight } from "lucide-react";
import { useThemeStore } from "@/stores/theme";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pb-24 sm:pb-6">
      <div className="px-4 py-6 sm:px-6 md:px-8 max-w-lg mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">设置</h1>

        {/* Theme Section */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">外观</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            {themeOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 text-left transition-colors",
                    "active:bg-muted",
                    index !== themeOptions.length - 1 && "border-b"
                  )}
                >
                  <Icon className="h-5 w-5 text-muted-foreground mr-3" />
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <span className="text-primary font-medium">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">关于</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b">
              <span className="flex-1">版本</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <button className="flex items-center w-full px-4 py-3 text-left active:bg-muted">
              <span className="flex-1">开源许可</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
