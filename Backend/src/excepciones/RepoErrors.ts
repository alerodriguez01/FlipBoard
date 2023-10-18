export default class SaltNotFoundError extends Error {
  constructor () {
    super('No se ha podido encontrar el Salt en la BDD');
    this.name = 'SaltNotFoundError'
  }
}
