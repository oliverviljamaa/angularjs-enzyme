export default class AngularjsEnzymeError extends Error {
  constructor(message) {
    super(`AngularJS Enzyme Error: ${message}`);
  }
}
