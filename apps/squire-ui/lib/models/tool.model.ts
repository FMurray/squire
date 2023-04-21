export class ToolImpl {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  type: string;

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.prefix = data.prefix
    this.suffix = data.suffix
    this.type = data.type
  }
}

// Example: 
// 
// let customTool  = new ToolImpl({
//   type: "web", 
//   url: "tauri docs"
// })

// generate({
//   custom_tools [customTool.ids]
// })