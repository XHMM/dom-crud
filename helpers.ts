// below are all pure functions

// return type string: array string function null...
export function getType(val: any): string {
  const rightPart = Object.prototype.toString.call(val).split(" ")[1];
  return rightPart.slice(0, rightPart.length - 1).toLowerCase();
}

/*
 * class name cannot contain space
 * ' a b c'  ===> ['a', 'b', 'c']
 * */
export function stringToDomClasses(str: string): string[] {
  return str
    .trim()
    .split(" ")
    .filter(item => item !== "");
}
