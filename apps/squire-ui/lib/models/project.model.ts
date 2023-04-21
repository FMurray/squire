export class ProjectImpl {
  id: string;
  name: string;
  fs_descriptor: string;

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.fs_descriptor = data.fs_descriptor
  }
}