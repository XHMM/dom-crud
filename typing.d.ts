type DomStringOptions = string[];
type DomObjectOption = Record<string, any>;

declare function cdom<K extends keyof HTMLElementTagNameMap>(tagName: K,...options:DomStringOptions): HTMLElementTagNameMap[K];
declare function cdom(tagName: string,...options:DomStringOptions): HTMLElement;
declare function cdom<K extends keyof HTMLElementTagNameMap>(tagName: K,option:DomObjectOption): HTMLElementTagNameMap[K];
declare function cdom(tagName: string,option:DomObjectOption): HTMLElement;

declare function rdom<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
declare function rdom<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
declare function rdom<E extends Element = Element>(selectors: string): E | null;
declare function rdoms<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
declare function rdoms<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
declare function rdoms<E extends Element = Element>(selectors: string): NodeListOf<E>;

declare function udom<T extends HTMLElement>($dom:T,...options:DomStringOptions):T;
declare function udom<T extends HTMLElement>($dom:T,option:DomObjectOption):T;

declare function ddom($dom):void;

export {
  cdom, rdom, rdoms, udom, ddom
}