declare function cdom(tagName: string, ...options: Array<string | Record<string, any>>): HTMLElement;
declare function rdom<E extends Element = Element>(selector: string): E | null;
declare function rdoms<E extends Element = Element>(selector: string): NodeListOf<E>;
declare function udom($dom: HTMLElement, ...options: Array<string | Record<string, any>>): HTMLElement;
declare function ddom($dom: HTMLElement | null): boolean;
export { cdom, rdom, rdoms, udom, ddom };
