export interface Generation {
  id: number,
  name: string,
  description: string,
  created: Date,
  modified: Date,
  deleted: Date
}

export class GenerationImpl implements Generation {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public created: Date,
    public modified: Date,
    public deleted: Date
  ) { }
}

export class GenerationFactory {
  static create(data: any): Generation {
    return new GenerationImpl(
      data.id,
      data.name,
      data.description,
      data.created,
      data.modified,
      data.deleted
    );
  }
}