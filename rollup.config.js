import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

const files = ['index.ts', 'config.ts', 'crud.ts', 'helpers.ts'];
const common = {
  input: './src/index.ts',
  watch: {
    include: files
  }
};
const plugins = [
  typescript(),
  replace({ BUILD: JSON.stringify(process.env.BUILD), include: files }),
  resolve(),
  commonjs()
];

const umdConfig = {
  ...common,
  output: {
    file: './build/index.umd.min.js',
    format: 'umd',
    name: 'crud'
  },
  // if put del plugin to common plugins, the first output will be cleared because del ran twice
  plugins: [...plugins, del({ targets: 'build/*' }), terser()]
};

const esmConfig = {
  ...common,
  output: {
    file: './build/index.esm.js',
    format: 'esm'
  },
  plugins: [...plugins]
};

const config = [umdConfig, esmConfig];
export default config;
