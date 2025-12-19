use crate::shortcuts::{register_shortcuts, unregister_all_shortcuts, ShortcutManager};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

fn build_menu(app: &AppHandle) -> Result<Menu<tauri::Wry>, String> {
    let manager = app.state::<ShortcutManager>();
    let config = manager.get_config();

    let show_keys = config.shortcuts.get("show_window").cloned();
    let settings_keys = config.shortcuts.get("open_settings").cloned();

    // Check window visibility to determine menu text
    let is_visible = app
        .get_webview_window("main")
        .map(|w| w.is_visible().unwrap_or(false))
        .unwrap_or(false);

    let toggle_label = if is_visible { "隐藏窗口" } else { "显示窗口" };

    let toggle = MenuItem::with_id(app, "toggle", toggle_label, true, show_keys.as_deref())
        .map_err(|e| e.to_string())?;
    let settings = MenuItem::with_id(app, "settings", "设置...", true, settings_keys.as_deref())
        .map_err(|e| e.to_string())?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)
        .map_err(|e| e.to_string())?;

    Menu::with_items(app, &[&toggle, &settings, &quit]).map_err(|e| e.to_string())
}

pub fn setup_tray(app: &AppHandle) -> Result<(), String> {
    let menu = build_menu(app)?;

    TrayIconBuilder::with_id("main")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_tray_icon_event(|tray, event| {
            let app = tray.app_handle();
            match event {
                // Menu opening - unregister shortcuts to prevent queued events
                TrayIconEvent::Click { button_state: MouseButtonState::Down, .. } => {
                    let _ = unregister_all_shortcuts(app);
                }
                // Menu closed (mouse released) - re-register shortcuts
                TrayIconEvent::Click { button_state: MouseButtonState::Up, .. } => {
                    let _ = register_shortcuts(app);
                }
                _ => {}
            }
        })
        .on_menu_event(|app, event| {
            // Re-register shortcuts when menu item selected (menu closes)
            let _ = register_shortcuts(app);

            match event.id.as_ref() {
                "toggle" => {
                    if let Some(window) = app.get_webview_window("main") {
                        if window.is_visible().unwrap_or(false) {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                        let _ = rebuild_tray(app);
                    }
                }
                "settings" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.emit("navigate", "/settings");
                        let _ = rebuild_tray(app);
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn rebuild_tray(app: &AppHandle) -> Result<(), String> {
    let menu = build_menu(app)?;

    if let Some(tray) = app.tray_by_id("main") {
        tray.set_menu(Some(menu)).map_err(|e| e.to_string())?;
    }

    Ok(())
}
