mod commands;
mod shortcuts;
mod tray;

use commands::*;
use shortcuts::{register_shortcuts, ShortcutManager};
use tauri::{Manager, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            // Initialize shortcut manager
            let shortcut_manager = ShortcutManager::new(&app.handle());
            app.manage(shortcut_manager);

            // Setup tray with shortcuts display
            tray::setup_tray(&app.handle())?;

            // Register global shortcuts
            register_shortcuts(&app.handle())?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            set_tray_visible,
            get_shortcuts,
            update_shortcut,
            get_shortcut_display
        ])
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn set_tray_visible(app: tauri::AppHandle, visible: bool) -> Result<(), String> {
    app.tray_by_id("main")
        .ok_or("Tray not found".to_string())?
        .set_visible(visible)
        .map_err(|e| e.to_string())
}
