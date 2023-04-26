use anyhow::Result;
use squire::{Application, Configuration};

#[tokio::main]
async fn main() -> Result<()> {
    let app = Application::initialize(Configuration::default()).await?;

    app.run().await
}
