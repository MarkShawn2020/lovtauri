import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import ThemeProvider from "./components/theme-provider";
import Nav from "./components/nav";
import Home from "./pages/home";
import Settings from "./pages/settings";
import { useSettingsStore } from "./stores/settings";
import { useGlobalShortcuts } from "./hooks/use-global-shortcuts";

function App() {
  const showTray = useSettingsStore((s) => s.showTray);

  // Register global shortcuts
  useGlobalShortcuts();

  useEffect(() => {
    invoke("set_tray_visible", { visible: showTray });
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex flex-1 flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
