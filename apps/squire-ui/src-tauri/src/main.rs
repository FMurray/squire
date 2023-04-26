#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod qdrant;
mod state;

pub use tauri::{plugin, App, AppHandle, Manager, Runtime, State};

use state::{AppState};

use std::sync::{Arc};

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
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
