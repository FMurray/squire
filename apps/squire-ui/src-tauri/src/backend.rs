use std::sync::Arc;

use squire::{Application};

use super::{plugin, App, Manager, Payload, Runtime};


pub(super) fn squire<R>(app: &mut App<R>) -> plugin::Result<()>
where
    R: Runtime,
{
  let app = app.handle();

} fn bleep