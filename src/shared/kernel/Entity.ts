export abstract class Entity<TId = string> {
  private readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  public equals(other: Entity<TId>): boolean {
    return this._id === other._id;
  }
}
