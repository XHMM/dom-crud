interface IWithRDom {
    rdom: typeof rdom;
}
declare function cdom<E extends HTMLElement = HTMLElement>(tagName: string, ...options: Array<string | Record<string, any>>): E;
declare function rdom<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] & IWithRDom | null;
declare function rdom<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] & IWithRDom | null;
declare function rdom<E extends Element = Element>(selectors: string): E & IWithRDom | null;
declare function rdoms<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
declare function rdoms<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
declare function rdoms<E extends Element = Element>(selectors: string): NodeListOf<E>;
declare function udom($dom: HTMLElement, ...options: Array<string | Record<string, any>>): void;
declare function ddom($dom: HTMLElement | null): boolean;
export { cdom, rdom, rdoms, udom, ddom };
