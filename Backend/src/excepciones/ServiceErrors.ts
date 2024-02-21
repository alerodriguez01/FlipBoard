class NotAuthorizedError extends Error {
    constructor (){
      super(`No tienes permisos para realizar esta accion`)
      this.name = `NotAuthorizedError`
    }
  }
  
  export { NotAuthorizedError }