#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JS!");
}

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let close = CustomMenuItem::new("close".to_string(), "Close");
  
  let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
  let prompts_submenu = Submenu::new(
    "Prompts",
    Menu::new()
      .add_item(CustomMenuItem::new("alert", "Alert"))
      .add_item(CustomMenuItem::new("confirm", "Confirm"))
      .add_item(CustomMenuItem::new("prompt", "Prompt")),
  );
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu)
    .add_submenu(prompts_submenu);

  tauri::Builder::default()
    .menu(menu)
    .invoke_handler(tauri::generate_handler![my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
