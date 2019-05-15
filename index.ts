import "./polyfill";
import { getCrudConfig, updateCrudConfig } from "./config";
import { cdom, rdom, rdoms, udom, ddom } from "./crud";
// @ts-ignore
if (BUILD == "development") updateCrudConfig({ debug: true });
export { getCrudConfig, updateCrudConfig, cdom, rdom, rdoms, udom, ddom };
