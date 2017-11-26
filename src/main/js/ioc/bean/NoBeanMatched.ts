export class NoBeanMatched extends Error {
  constructor (beanIdOrType: string) {
    super('No bean matched: ' + beanIdOrType)
  }
}
