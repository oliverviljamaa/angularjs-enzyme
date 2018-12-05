import { getPropsDefinition, compile } from '.';

const mockInjectorGet = jest.fn();
jest.mock('angular', () => ({
  mock: {
    inject: injectable => {
      injectable({
        get: mockInjectorGet,
      });
    },
  },
}));
jest.mock('angular-mocks', () => {});

describe('Component', () => {
  describe('getPropsDefinition', () => {
    it('gets props definition for component', () => {
      mockInjectorGet.mockImplementation(() => [{ bindToController: {} }]);

      expect(mockInjectorGet).not.toBeCalled();
      getPropsDefinition('a-component');
      expect(mockInjectorGet).toBeCalledWith('aComponentDirective');
    });

    it('returns props definition', () => {
      mockInjectorGet.mockImplementation(() => [
        { bindToController: { prop: '<', anotherProp: '&' } },
      ]);

      const propsDefinition = getPropsDefinition('a-component');

      expect(propsDefinition).toEqual({ prop: '<', anotherProp: '&' });
    });
  });

  describe('compile', () => {
    let compiledElement;
    let $rootScope;
    let $compileWithTemplate;
    let $compile;
    beforeEach(() => {
      compiledElement = { angular: 'element' };
      $rootScope = { $digest: jest.fn() };
      $compileWithTemplate = jest.fn(() => compiledElement);
      $compile = jest.fn(() => $compileWithTemplate);
      mockInjectorGet.mockImplementation(name => {
        if (name === '$rootScope') {
          return $rootScope;
        }
        if (name === '$compile') {
          return $compile;
        }
        return null;
      });
    });

    it('compiles template with props under $ctrl property', () => {
      expect($compile).not.toBeCalled();
      expect($compileWithTemplate).not.toBeCalled();
      compile('template', {
        prop: 'Value',
        anotherProp: 'Another value',
      });
      expect($compile).toBeCalledWith('template');
      expect($compileWithTemplate).toBeCalledWith({
        $ctrl: { anotherProp: 'Another value', prop: 'Value' },
        $digest: expect.any(Function),
      });
    });

    it('runs digest cycle', () => {
      expect($rootScope.$digest).not.toBeCalled();
      compile('template');
      expect($rootScope.$digest).toBeCalled();
    });

    it('returns compiled element', () => {
      const element = compile('template', {
        prop: 'Value',
        anotherProp: 'Another value',
      });

      expect(element).toBe(compiledElement);
    });
  });
});
