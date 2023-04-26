use qdrant_client::prelude::*;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager, State};

pub struct AppState {
    pub qdrant: Arc<Mutex<QdrantClient>>,
}

// pub trait ServiceAccess {
//     fn qdrant<F, TResult>(&self, operation: F) -> TResult
//     where
//         F: FnOnce(&QdrantClient) -> TResult;

//     fn qdrant_mut<F, TResult>(&self, operation: F) -> TResult
//     where
//         F: FnOnce(&mut QdrantClient) -> TResult;
// }

// impl ServiceAccess for AppHandle {
//     fn qdrant<F, TResult>(&self, operation: F) -> TResult
//     where
//         F: FnOnce(&QdrantClient) -> TResult,
//     {
//         let app_state: State<AppState> = self.state();
//         let qdrant_connection_guard = app_state.qdrant.lock().unwrap();
//         let qdrant = qdrant_connection_guard.as_ref().unwrap();

//         operation(qdrant)
//     }

//     fn qdrant_mut<F, TResult>(&self, operation: F) -> TResult
//     where
//         F: FnOnce(&mut QdrantClient) -> TResult,
//     {
//         let app_state: State<AppState> = self.state();
//         let mut qdrant_connection_guard = app_state.qdrant.lock().unwrap();
//         let qdrant = qdrant_connection_guard.as_mut().unwrap();

//         operation(qdrant)
//     }
// }
