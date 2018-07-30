import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    format: 'umd',
    name: 'angularjsTest',
    file: 'dist/angularjs-test.js',
  },
  plugins: [babel({ exclude: 'node_modules/**' })],
};
