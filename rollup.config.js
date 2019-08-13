import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';

const files = ['index.ts', 'config.ts', 'crud.ts', 'helpers.ts', 'logger.ts'];
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
  commonjs(),
  terser()
];

const browserConfig = {
  ...common,
  output: {
    file: './build/index.browser.min.js',
    format: 'iife',
    name: 'window',
    extend: true
  },
  plugins: [
    babel(),
    ...plugins,
    // if put del plugin to common plugins, the first output will be cleared because del ran twice
    del({ targets: 'build/*' })
  ]
};

const esmConfig = {
  ...common,
  output: {
    file: './build/index.esm.js',
    format: 'esm'
  },
  plugins: [...plugins]
};

const config = [browserConfig, esmConfig];
export default config;
