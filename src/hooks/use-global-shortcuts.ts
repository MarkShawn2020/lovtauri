import { useEffect } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useShortcutsStore } from "@/stores/shortcuts";

export function useGlobalShortcuts() {
  const { shortcuts, fetchShortcuts } = useShortcutsStore();

  useEffect(() => {
    fetchShortcuts();
  }, []);

  useEffect(() => {
    const showWindowShortcut = shortcuts.show_window;
    if (!showWindowShortcut) return;

    let registered = false;

    const registerShortcut = async () => {
      try {
        await register(showWindowShortcut, async () => {
          console.log("Global shortcut triggered:", showWindowShortcut);
          const window = getCurrentWindow();
          const visible = await window.isVisible();
          if (visible) {
            await window.hide();
          } else {
            await window.show();
            await window.setFocus();
          }
        });
        registered = true;
        console.log("Registered global shortcut:", showWindowShortcut);
      } catch (e) {
        console.error("Failed to register shortcut:", e);
      }
    };

    registerShortcut();

    return () => {
      if (registered) {
        unregister(showWindowShortcut).catch(console.error);
      }
    };
  }, [shortcuts.show_window]);
}
