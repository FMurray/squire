use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use tauri::api::dialog;

fn main() {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let fileMenu = Submenu::new("File", Menu::new().add_item(open));
    let menu = Menu::new()
      .add_submenu(fileMenu)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit);
  
    tauri::Builder::default()
      .menu(menu)
      .on_menu_event(|event| match event.menu_item_id() {
        "open" => {
          dialog::FileDialogBuilder::default()
            .add_filter("Markdown", &["md"])
            .pick_file(|path_buf| match path_buf {
              Some(p) => {}
              _ => {}
            });
        }
        _ => {}
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
