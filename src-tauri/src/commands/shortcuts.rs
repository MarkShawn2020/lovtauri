use crate::shortcuts::{format_shortcut_for_display, unregister_shortcut, ShortcutConfig, ShortcutManager};
use crate::tray::rebuild_tray;
use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

#[tauri::command]
pub fn get_shortcuts(app: AppHandle) -> Result<ShortcutConfig, String> {
    let manager = app.state::<ShortcutManager>();
    Ok(manager.get_config())
}

#[tauri::command]
pub fn update_shortcut(app: AppHandle, action: String, keys: String) -> Result<(), String> {
    let manager = app.state::<ShortcutManager>();

    // Unregister old shortcut
    if let Some(old_keys) = manager.get_shortcut(&action) {
        let _ = unregister_shortcut(&app, &old_keys);
    }

    // Update config
    manager.update_shortcut(&action, &keys)?;

    // Register new shortcut
    let shortcut: Shortcut = keys.parse().map_err(|e| format!("{:?}", e))?;
    let action_clone = action.clone();
    let app_clone = app.clone();

    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, _event| {
            match action_clone.as_str() {
                "show_window" => {
                    if let Some(window) = app_clone.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .map_err(|e| e.to_string())?;

    // Rebuild tray to show updated shortcut
    rebuild_tray(&app)?;

    Ok(())
}

#[tauri::command]
pub fn get_shortcut_display(keys: String) -> String {
    format_shortcut_for_display(&keys)
}
