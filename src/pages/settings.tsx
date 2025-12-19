import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, ChevronRight, ChevronDown, Keyboard } from "lucide-react";
import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { useThemeStore } from "@/stores/theme";
import { useSettingsStore } from "@/stores/settings";
import { useShortcutsStore } from "@/stores/shortcuts";
import { ShortcutRecorder } from "@/components/shortcut-recorder";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
];

const SHORTCUT_LABELS: Record<string, string> = {
  show_window: "显示/隐藏窗口",
  open_settings: "打开设置",
};

export default function Settings() {
  const { theme, setTheme } = useThemeStore();
  const { showTray, setShowTray } = useSettingsStore();
  const { shortcuts, fetchShortcuts, updateShortcut, getDisplayKeys } =
    useShortcutsStore();
  const [version, setVersion] = useState("");
  const [showLicense, setShowLicense] = useState(false);
  const [displayKeys, setDisplayKeys] = useState<Record<string, string>>({});
  const [autostart, setAutostart] = useState(true);

  useEffect(() => {
    getVersion().then(setVersion);
    fetchShortcuts();
    invoke<boolean>("get_autostart").then(setAutostart);
  }, []);

  useEffect(() => {
    // Update display keys when shortcuts change
    Object.entries(shortcuts).forEach(async ([action, keys]) => {
      const display = await getDisplayKeys(keys);
      setDisplayKeys((prev) => ({ ...prev, [action]: display }));
    });
  }, [shortcuts]);

  useEffect(() => {
    invoke("set_tray_visible", { visible: showTray });
  }, [showTray]);

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

        {/* Shortcuts Section */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">快捷键</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            {Object.entries(shortcuts).map(([action, keys], index) => (
              <div
                key={action}
                className={cn(
                  "flex items-center px-4 py-3",
                  index !== Object.keys(shortcuts).length - 1 && "border-b"
                )}
              >
                <Keyboard className="h-5 w-5 text-muted-foreground mr-3" />
                <span className="flex-1">{SHORTCUT_LABELS[action] || action}</span>
                <ShortcutRecorder
                  value={keys}
                  displayValue={displayKeys[action] || keys}
                  onChange={(newKeys) => updateShortcut(action, newKeys)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* General Section */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">通用</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            <button
              onClick={() => {
                const newValue = !autostart;
                setAutostart(newValue);
                invoke("set_autostart", { enabled: newValue });
              }}
              className="flex items-center w-full px-4 py-3 text-left border-b"
            >
              <span className="flex-1">开机自启动</span>
              <div
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  autostart ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    autostart ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </div>
            </button>
            <button
              onClick={() => setShowTray(!showTray)}
              className="flex items-center w-full px-4 py-3 text-left"
            >
              <span className="flex-1">显示托盘图标</span>
              <div
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  showTray ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    showTray ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </div>
            </button>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">关于</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="flex items-center px-4 py-4 border-b">
              <img src="/lovpen-logo.svg" className="h-10 w-10 mr-3" alt="Logo" />
              <div>
                <div className="font-medium">Lovtauri</div>
                <div className="text-xs text-muted-foreground">版本 {version}</div>
              </div>
            </div>
            <button
              onClick={() => setShowLicense(!showLicense)}
              className="flex items-center w-full px-4 py-3 text-left active:bg-muted"
            >
              <span className="flex-1">开源许可</span>
              {showLicense ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {showLicense && (
              <div className="px-4 py-3 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  MIT License © {new Date().getFullYear()} Lovstudio
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
