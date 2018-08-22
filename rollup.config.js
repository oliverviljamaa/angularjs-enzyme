import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'src/main.js',
  output: {
    format: 'umd',
    name: 'angularjsEnzyme',
    file: 'dist/angularjs-enzyme.js',
  },
  plugins: [resolve(), babel({ exclude: 'node_modules/**' }), cleanup()],
};
