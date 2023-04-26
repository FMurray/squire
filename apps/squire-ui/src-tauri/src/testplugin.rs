// use tauri::{
//     plugin::{Builder, TauriPlugin},
//     AppHandle, Manager, Runtime, State,
// };

// use anyhow::Result;
// use qdrant_client::prelude::*;

// use std::sync::Mutex;

// #[derive(Default)]
// struct QdrantConnection(Mutex<Option<QdrantClient>>);

// // #[tauri::command]
// // fn connect(connection: State<'_, QdrantConnection>) {
// //   *connection.0.lock().unwrap() = Some(QdrantClient {});
// // }

// #[tauri::command]
// // this will be accessible with `invoke('plugin:awesome|do_something')`.
// fn list_collections<R: Runtime>(_app: AppHandle<R>, state: State<'_, QdrantConnection>) {
//     // you can access `MyState` here!
//     dbg!("hey from JS!");
// }

// pub fn init<R: Runtime>() -> TauriPlugin<R> {
//     Builder::new("index")
//         .invoke_handler(tauri::generate_handler![list_collections])
//         .setup(|app_handle| {
//           // setup plugin specific state here
//           let connection_state: State<QdrantConnection> = app_handle.state();
//           let client = wait_for_qdrant();
//           app_handle.manage(QdrantConnection::default());
//           Ok(())
//         })
//         .build()
// }

// async fn wait_for_qdrant() -> Result<QdrantClient> {

//   let config = QdrantClientConfig::from_url("http://localhost:6334");
//   let client = QdrantClient::new(Some(config)).await?;

//   for _ in 0..60 {
//     if qdrant.health_check().await.is_ok() {
//         return;
//     }

//     tokio::time::sleep(Duration::from_secs(1)).await;
//   }

//   Ok(client)
// }
