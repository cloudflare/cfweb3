import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'index.ts',
  output: {
    file: 'build/out.js',
    sourcemap: true,
  },

  plugins: [
    typescript(),
    commonjs(),
    nodeResolve({ browser: true }),
    terser(),
  ],
}