import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

interface ShortcutConfig {
  shortcuts: Record<string, string>;
}

interface ShortcutsStore {
  shortcuts: Record<string, string>;
  loading: boolean;
  fetchShortcuts: () => Promise<void>;
  updateShortcut: (action: string, keys: string) => Promise<void>;
  getDisplayKeys: (keys: string) => Promise<string>;
}

export const useShortcutsStore = create<ShortcutsStore>()((set, get) => ({
  shortcuts: {},
  loading: true,

  fetchShortcuts: async () => {
    try {
      const config = await invoke<ShortcutConfig>("get_shortcuts");
      set({ shortcuts: config.shortcuts, loading: false });
    } catch (e) {
      console.error("Failed to fetch shortcuts:", e);
      set({ loading: false });
    }
  },

  updateShortcut: async (action: string, keys: string) => {
    try {
      await invoke("update_shortcut", { action, keys });
      set((state) => ({
        shortcuts: { ...state.shortcuts, [action]: keys },
      }));
    } catch (e) {
      console.error("Failed to update shortcut:", e);
      throw e;
    }
  },

  getDisplayKeys: async (keys: string) => {
    try {
      return await invoke<string>("get_shortcut_display", { keys });
    } catch {
      return keys;
    }
  },
}));
