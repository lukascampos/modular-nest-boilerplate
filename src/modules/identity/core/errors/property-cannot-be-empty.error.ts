export class PropertyCannotBeEmptyError extends Error {
  constructor(property: string) {
    super(`${property} cannot be empty.`);
    this.name = 'PropertyCannotBeEmptyError';
  }
}
