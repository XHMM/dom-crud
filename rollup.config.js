import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";

const common = {
  input: "./index.ts",
  watch: {
    include: ["index.ts", "utils.ts"]
  }
};
const plugins = [typescript(), ];

const umdConfig = {
  ...common,
  output: {
    file: "./build/index.umd.min.js",
    format: "umd",
    name: "crud"
  },
  // if put del plugin to common plugins, the first output will be cleared because del ran twice
  plugins: [...plugins, del({ targets: "build/*" }), terser()]
};

const esmConfig = {
  ...common,
  output: {
    file: "./build/index.esm.js",
    format: "esm"
  },
  plugins: [...plugins]
};

export default [umdConfig, esmConfig];
