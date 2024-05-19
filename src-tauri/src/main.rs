// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{ffi::OsStr, path::Path, sync::mpsc::channel, time::{Duration, SystemTime}};

use notify_debouncer_mini::{new_debouncer, DebounceEventResult};
use tauri::{api::cli::Matches, App, Manager, Window};
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main = app
                .get_window("main")
                .expect("Couldn't get main window handle");
            let matches = App::get_cli_matches(&app)?;
            if matches.args.get("notify").is_some_and(|x| x.value.as_bool().is_some_and(|y| !y)) {
                tauri::async_runtime::spawn(async move {
                    watch_files(main, matches).await.unwrap();
                });
            }else {
                println!("Warning: File watching has been turned OFF; the page wont update its location")
            }
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
        Duration::from_millis(300),
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
    let mut last_time = SystemTime::now();
    while let Ok(x) = rx.recv() {
        if let Ok(time) = last_time.elapsed() {
            if time <= Duration::from_millis(100) { // TODO: hardcoded
                println!("Skipped update (< 100ms)");
                continue;
            }
        }
        last_time = SystemTime::now();
        let path = x.as_path();
        if path.exists() && path.extension() == Some(&OsStr::new("md")) {
            let location = path
                .to_str()
                .unwrap_or_default()
                .strip_prefix(base.to_str().unwrap_or_default())
                .unwrap_or_default();
            let location = location.trim().replace("\\", "/");
            println!("File changed: {:?}", location);
            window.eval(&format!("if(window.location.pathname === '{}'){{
                sessionStorage.setItem('scrollpos', window.scrollY);
            }}else{{
                sessionStorage.removeItem('scrollpos');
            }}
            window.location.pathname = '{}';
            window.location.hash = '';", location, location))?;
        }
    }
    Ok(())
}
