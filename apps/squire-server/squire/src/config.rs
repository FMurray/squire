use anyhow::Result;
use clap::Parser;
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Serialize, Deserialize, Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct Configuration {
    #[clap(long, default_value_t = default_host())]
    #[serde(default = "default_host")]
    /// Bind the webserver to `<port>`
    pub host: String,

    #[clap(long, default_value_t = default_port())]
    #[serde(default = "default_port")]
    /// Bind the webserver to `<host>`
    pub port: u16,
}

impl Configuration {
    pub fn read(file: impl AsRef<Path>) -> Result<Self> {
        let file = std::fs::File::open(file)?;
        Ok(serde_json::from_reader::<_, Self>(file)?)
    }

    pub fn default() -> Self {
        Self {
            host: default_host(),
            port: default_port(),
        }
    }

    // pub fn cli_overriding_config_file() -> Result<Self> {
    //     let cli = Self::from_cli()?;
    //     let Ok(file) = cli.config_file.as_ref().context("no config file specified").and_then(Self::read) else {
    //     return Ok(cli);
    // };

    //     Ok(Self::merge(file, cli))
    // }
}

const fn default_port() -> u16 {
    7878
}

fn default_host() -> String {
    String::from("127.0.0.1")
}
