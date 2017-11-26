export class ClassNotFound extends Error {
  constructor (classString: string) {
    super('Class name given as string: "' + classString + '" couldn\'t be resolved as a class')
  }
}
