use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShortcutConfig {
    pub shortcuts: HashMap<String, String>,
}

impl Default for ShortcutConfig {
    fn default() -> Self {
        let mut shortcuts = HashMap::new();
        shortcuts.insert("show_window".to_string(), "CommandOrControl+Shift+L".to_string());
        shortcuts.insert("open_settings".to_string(), "CommandOrControl+,".to_string());
        Self { shortcuts }
    }
}

pub struct ShortcutManager {
    config: Mutex<ShortcutConfig>,
    config_path: PathBuf,
}

impl ShortcutManager {
    pub fn new(app: &AppHandle) -> Self {
        let config_dir = app
            .path()
            .app_config_dir()
            .unwrap_or_else(|_| dirs::config_dir().unwrap().join("lovtauri"));

        let _ = fs::create_dir_all(&config_dir);
        let config_path = config_dir.join("shortcuts.json");

        let config = if config_path.exists() {
            fs::read_to_string(&config_path)
                .ok()
                .and_then(|s| serde_json::from_str(&s).ok())
                .unwrap_or_default()
        } else {
            ShortcutConfig::default()
        };

        Self {
            config: Mutex::new(config),
            config_path,
        }
    }

    pub fn get_config(&self) -> ShortcutConfig {
        self.config.lock().unwrap().clone()
    }

    pub fn save_config(&self) -> Result<(), String> {
        let config = self.config.lock().unwrap();
        let json = serde_json::to_string_pretty(&*config).map_err(|e| e.to_string())?;
        fs::write(&self.config_path, json).map_err(|e| e.to_string())
    }

    pub fn update_shortcut(&self, action: &str, keys: &str) -> Result<(), String> {
        {
            let mut config = self.config.lock().unwrap();
            config.shortcuts.insert(action.to_string(), keys.to_string());
        }
        self.save_config()
    }

    pub fn get_shortcut(&self, action: &str) -> Option<String> {
        self.config.lock().unwrap().shortcuts.get(action).cloned()
    }
}

pub fn register_shortcuts(app: &AppHandle) -> Result<(), String> {
    // First unregister all to avoid duplicate callbacks
    let _ = app.global_shortcut().unregister_all();

    let manager = app.state::<ShortcutManager>();
    let config = manager.get_config();

    for (action, keys) in config.shortcuts.iter() {
        if let Err(e) = register_single_shortcut(app, action, keys) {
            eprintln!("Failed to register shortcut {}: {}", action, e);
        }
    }

    Ok(())
}

fn register_single_shortcut(app: &AppHandle, action: &str, keys: &str) -> Result<(), String> {
    let shortcut: Shortcut = keys.parse().map_err(|e| format!("{:?}", e))?;
    let action = action.to_string();
    let app_clone = app.clone();

    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                handle_shortcut_action(&app_clone, &action);
            }
        })
        .map_err(|e| e.to_string())
}

fn handle_shortcut_action(app: &AppHandle, action: &str) {
    match action {
        "show_window" => {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
                let _ = crate::tray::rebuild_tray(app);
            }
        }
        "open_settings" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("navigate", "/settings");
                let _ = crate::tray::rebuild_tray(app);
            }
        }
        _ => {}
    }
}

pub fn unregister_shortcut(app: &AppHandle, keys: &str) -> Result<(), String> {
    let shortcut: Shortcut = keys.parse().map_err(|e| format!("{:?}", e))?;
    app.global_shortcut()
        .unregister(shortcut)
        .map_err(|e| e.to_string())
}

pub fn unregister_all_shortcuts(app: &AppHandle) -> Result<(), String> {
    app.global_shortcut()
        .unregister_all()
        .map_err(|e| e.to_string())
}

pub fn format_shortcut_for_display(keys: &str) -> String {
    #[cfg(target_os = "macos")]
    {
        keys.replace("CommandOrControl", "⌘")
            .replace("Command", "⌘")
            .replace("Control", "⌃")
            .replace("Shift", "⇧")
            .replace("Alt", "⌥")
            .replace("+", "")
    }
    #[cfg(not(target_os = "macos"))]
    {
        keys.replace("CommandOrControl", "Ctrl")
    }
}
