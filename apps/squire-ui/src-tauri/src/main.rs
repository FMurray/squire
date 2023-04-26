#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use squire::Application;

mod qdrant;
mod state;

pub use tauri::{plugin, App, AppHandle, Manager, Runtime, State};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// #[tauri::command]
// async fn list_collections(app_handle: AppHandle) {
//     // // Should handle errors instead of unwrapping here
//     // app_handle.qdrant(|qdrant| qdrant::add_item(name, qdrant)).unwrap();

//     let items = app_handle.qdrant(|qdrant| qdrant::list_collections(qdrant)).await;
//     dbg!(items);

//     // format!("Your name log: {}", items_string)
// }

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .plugin(qdrant::QdrantSupervisor::default())
        .invoke_handler(tauri::generate_handler![show_folder_in_finder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn show_folder_in_finder(path: String) {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(path)
            .arg("-R") // will reveal the file in finder instead of opening it
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(path)
            .spawn()
            .unwrap();
    }
}

// .manage(AppState { qdrant: Arc::default() })
// .setup(|app| {
//   let app_handle = app.handle();
//   let app_state: State<AppState> = app_handle.state();

//   let qdrant_conn_state = Arc::clone(&app_state.qdrant);

//   tauri::async_runtime::spawn(async move {
//     let rt = tokio::runtime::Handle::current();
//     let rt_ = rt.clone();
//     rt.spawn_blocking(move || {
//       let mut conn_state = qdrant_conn_state.lock().unwrap()
//       rt_.block_on(async {
//         // let client = tokio::task::LocalSet::new();
//         // client
//         //   .run_until(qdrant::initialize_qdrant(&app_handle))
//         //   .await;
//         let client = qdrant::initialize_qdrant(&app_handle)
//         *conn_state = client;
//       })
//     })

//   });

//   Ok(())
// })
