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

class DeleteError extends Error {
  constructor (modelA: string, modelsB: string[]){
    super(`Ya existe una relacion entre ${modelA} y ${modelsB.join(', ')}`)
    this.name = `Delete${modelA}Error`
  }
}

export { NotFoundError, InvalidValueError, DeleteError }
