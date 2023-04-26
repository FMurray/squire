use anyhow::Result;
use std::sync::Arc;

use tracing::error;

mod config;
mod webserver;

pub use config::Configuration;

#[derive(Clone)]
pub struct Application {
    /// User-provided configuration
    pub config: Arc<Configuration>,
    // /// Repositories managed by Bloop
    // repo_pool: RepositoryPool,

    // /// Background & maintenance tasks are executed on a separate
    // /// executor
    // background: BackgroundExecutor,

    // /// Semantic search subsystem
    // semantic: Option<Semantic>,

    // /// Tantivy indexes
    // indexes: Arc<Indexes>,

    // /// Remote backend credentials
    // credentials: remotes::Backends,

    // /// Main cookie encryption keypair
    // cookie_key: axum_extra::extract::cookie::Key,

    // /// Conversational store cache
    // prior_conversational_store: Arc<scc::HashMap<String, Vec<(String, String)>>>,

    // /// Analytics backend -- may be unintialized
    // analytics: Option<Arc<analytics::RudderHub>>,
}

impl Application {
    pub async fn initialize(config: Configuration) -> Result<Application> {
        let config = Arc::new(config);

        Ok(Self { config })
    }

    pub async fn run(self) -> Result<()> {
        let mut joins = tokio::task::JoinSet::new();

        joins.spawn(webserver::start(self));

        while let Some(result) = joins.join_next().await {
            if let Ok(Err(err)) = result {
                error!(?err, "bleep failure");
                return Err(err);
            }
        }

        Ok(())
    }
}

fn main() {
    println!("Hello, world!");
}
