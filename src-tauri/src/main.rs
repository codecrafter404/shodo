// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{ffi::OsStr, path::Path, sync::mpsc::channel, time::Duration};

use notify_debouncer_mini::{new_debouncer, DebounceEventResult};
use tauri::{api::cli::Matches, App, Manager, Window};
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main = app
                .get_window("main")
                .expect("Couldn't get main window handle");
            let matches = App::get_cli_matches(&app)?;
            tauri::async_runtime::spawn(async move {
                watch_files(main, matches).await.unwrap();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn watch_files(window: Window, matches: Matches) -> color_eyre::Result<()> {
    let base = match matches.args.get("path") {
        Some(x) => x.value.as_str().unwrap_or_default().to_owned(),
        None => String::default(),
    };
    let base = Path::new(&base);
    println!("Watching in base {:?}", base);
    let (tx, rx) = channel();
    let mut debouncer = new_debouncer(
        Duration::from_millis(200),
        move |res: DebounceEventResult| match res {
            Ok(event) => {
                for event in event {
                    tx.send(event.path).unwrap();
                }
            }
            Err(e) => println!("Error: {:?}", e),
        },
    )?;

    debouncer
        .watcher()
        .watch(base, notify::RecursiveMode::Recursive)?;
    while let Ok(x) = rx.recv() {
        let path = x.as_path();
        if path.exists() && path.extension() == Some(&OsStr::new("md")) {
            let location = path
                .to_str()
                .unwrap_or_default()
                .strip_prefix(base.to_str().unwrap_or_default())
                .unwrap_or_default();
            let location = location.trim().replace("\\", "/");
            println!("File changed: {:?}", location);
            window.eval(&format!("window.location.pathname = '{}'", location))?;
        }
    }
    Ok(())
}
