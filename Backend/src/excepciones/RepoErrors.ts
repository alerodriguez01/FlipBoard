class NotFoundError extends Error {
  constructor (model: string) {
    super(`No se ha podido encontrar '${model}' en la BDD`);
    this.name = `${model}NotFoundError`;
  }
}

export { NotFoundError }
