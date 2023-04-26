use crate::Application;
use axum::{http::StatusCode, response::IntoResponse, routing::get, Extension, Json};
use serde::{Deserialize, Serialize, Serializer};
use std::path::Path;
use std::{borrow::Cow, net::SocketAddr};
use tracing::info;

pub type Router<S = Application> = axum::Router<S>;

pub async fn start(app: Application) -> anyhow::Result<()> {
    let bind = SocketAddr::new(app.config.host.parse()?, app.config.port);

    let mut api = Router::new();

    let mut router = Router::new().nest("/api", api);

    info!(%bind, "starting webserver");
    axum::Server::bind(&bind)
        .serve(router.into_make_service())
        .await?;

    Ok(())
}
