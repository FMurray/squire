use tauri::AppHandle;
use qdrant_client::prelude::*;
use anyhow::Result;

use std::{
  fs::{create_dir_all, write},
  process::{Child},
};

use tauri::{plugin::Plugin, Runtime};


// pub async fn list_collections(qdrant: &QdrantClient) -> Result<ListCollectionsResponse> {
  //   let collections_list = qdrant.list_collections().await;
  //   Ok(collections_list)
  // }

#[derive(Default)]
pub(super) struct QdrantSupervisor {
  child: Option<Child>,
}


impl<R> Plugin<R> for QdrantSupervisor
where
R: Runtime,
{
  fn name(&self) -> &'static str {
    "qdrant"
  }
  
  fn initialize(
    
    &mut self,
    app: &tauri::AppHandle<R>,
    _config: serde_json::Value,
  ) -> tauri::plugin::Result<()> {
    let cache_dir = app.path_resolver().app_cache_dir().unwrap();
    let qdrant_dir = cache_dir.join("qdrant");
    let qd_config_dir = qdrant_dir.join("config");
    create_dir_all(&qd_config_dir).unwrap();
    write(
      qd_config_dir.join("config.yaml"),
      format!(
        include_str!("./QDRANT_CONFIG_TEMPLATE.yml"),
        storage = &qdrant_dir.join("storage").to_string_lossy(),
        snapshots = &qdrant_dir.join("snapshots").to_string_lossy()
      ),
    ).unwrap();
    
    
    tokio::task::block_in_place(move || {
      tokio::runtime::Handle::current().block_on(initialize_qdrant())
    });
    
    Ok(())
  }
}
  
async fn initialize_qdrant() -> Result<QdrantClient> {

  let config = QdrantClientConfig::from_url("http://localhost:6334");
  let client = QdrantClient::new(Some(config)).await?;
  
  Ok(client)
}
  
  //   fn on_event(&mut self, _app: &tauri::AppHandle<R>, event: &tauri::RunEvent) {
    //     use tauri::RunEvent::Exit;
    //     if let Exit = event {
      //         self.child
      //             .take()
//             .expect("qdrant not started")
//             .kill()
//             .expect("failed to kill qdrant")
//     }
//   }
// }

// #[cfg(unix)]
// fn run_command(command: &Path, qdrant_dir: &Path) -> Child {
//     use nix::sys::resource::{getrlimit, setrlimit, Resource};
//     use tracing::{error, info};
//     match getrlimit(Resource::RLIMIT_NOFILE) {
//         Ok((current_soft, current_hard)) if current_hard < 2048 => {
//             if let Err(err) = setrlimit(Resource::RLIMIT_NOFILE, 1024, 2048) {
//                 error!(
//                     ?err,
//                     new_soft = 1024,
//                     new_hard = 2048,
//                     current_soft,
//                     current_hard,
//                     "failed to set rlimit/nofile"
//                 );
//             }
//         }
//         Ok((current_soft, current_hard)) => {
//             info!(current_soft, current_hard, "no change to rlimit needed");
//         }
//         Err(err) => {
//             error!(?err, "failed to get rlimit/nofile");
//         }
//     }

//     // nix::sys::resource::setrlimit().unwrap();
//     Command::new(command)
//         .current_dir(qdrant_dir)
//         .spawn()
//         .expect("failed to start qdrant")
// }

// #[cfg(windows)]
// fn run_command(command: &Path, qdrant_dir: &Path) -> Child {
//     Command::new(command)
//         .current_dir(qdrant_dir)
//         .spawn()
//         .expect("failed to start qdrant")
// }
