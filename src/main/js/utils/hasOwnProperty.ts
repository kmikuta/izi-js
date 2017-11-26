export function hasOwnProperty (object: any, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, property)
}
