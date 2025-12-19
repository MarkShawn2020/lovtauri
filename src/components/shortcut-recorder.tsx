import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ShortcutRecorderProps {
  value: string;
  displayValue: string;
  onChange: (keys: string) => void;
  className?: string;
}

const MODIFIER_KEYS = ["Control", "Alt", "Shift", "Meta"];
const KEY_MAP: Record<string, string> = {
  Meta: "CommandOrControl",
  Control: "CommandOrControl",
  " ": "Space",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
};

export function ShortcutRecorder({
  value,
  displayValue,
  onChange,
  className,
}: ShortcutRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!recording) return;
      e.preventDefault();
      e.stopPropagation();

      const key = e.key;
      setCurrentKeys((prev) => new Set(prev).add(key));

      // If a non-modifier key is pressed, finalize the shortcut
      if (!MODIFIER_KEYS.includes(key)) {
        const modifiers: string[] = [];
        if (e.metaKey || e.ctrlKey) modifiers.push("CommandOrControl");
        if (e.shiftKey) modifiers.push("Shift");
        if (e.altKey) modifiers.push("Alt");

        const mainKey = KEY_MAP[key] || key.toUpperCase();
        const shortcut = [...modifiers, mainKey].join("+");

        onChange(shortcut);
        setRecording(false);
        setCurrentKeys(new Set());
      }
    },
    [recording, onChange]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!recording) return;
      setCurrentKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    },
    [recording]
  );

  const handleBlur = useCallback(() => {
    setRecording(false);
    setCurrentKeys(new Set());
  }, []);

  useEffect(() => {
    if (recording) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [recording, handleKeyDown, handleKeyUp]);

  return (
    <button
      onClick={() => setRecording(true)}
      onBlur={handleBlur}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-mono transition-colors",
        "border border-border bg-muted/50",
        recording
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "hover:bg-muted",
        className
      )}
    >
      {recording ? (
        <span className="text-primary animate-pulse">按下快捷键...</span>
      ) : (
        <span className="text-muted-foreground">{displayValue || value}</span>
      )}
    </button>
  );
}
