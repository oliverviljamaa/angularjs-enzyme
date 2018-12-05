import AngularjsEnzymeError from './AngularjsEnzymeError';

describe('AngularJS Enzyme error', () => {
  it('prepends error message with "AngularJS Enzyme Error: "', () => {
    expect(new AngularjsEnzymeError('Some message').message).toBe(
      'AngularJS Enzyme Error: Some message',
    );
  });
});
