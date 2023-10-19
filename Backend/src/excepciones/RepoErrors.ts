class NotFoundError extends Error {
  constructor (model: string) {
    super(`No se ha podido encontrar '${model}' en la BDD`);
    this.name = `${model}NotFoundError`;
  }
}

class InvalidValueError extends Error {
  constructor (model: string, attr: string){
    super(`Valor invalido para el atributo ${attr} de ${model}`)
    this.name = `${model}Invalid${attr}ValueError`
  }
}
export { NotFoundError, InvalidValueError }
