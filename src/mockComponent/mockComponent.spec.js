import 'angular';
import 'angular-mocks';

import mockComponent from '.';

describe('Mock component', () => {
  let $scope;
  let mockedComponent;
  beforeEach(() => {
    angular.module('some-module', []).component('someComponent', {
      bindings: { someProp: '<', onSomePropChange: '&' },
    });

    angular.mock.module('some-module');

    mockedComponent = mockComponent('some-component');

    angular.mock.inject($injector => {
      $scope = $injector.get('$rootScope').$new();
    });
  });

  describe('exists', () => {
    it('is true when in mounted template', () => {
      mount(`
        <div>Something else</div>
        <some-component></some-component>
      `);

      expect(mockedComponent.exists()).toBe(true);
    });

    it('is false when not in template', () => {
      mount('<div>Something else</div>');

      expect(mockedComponent.exists()).toBe(false);
    });

    it('is false when not in mounted template', () => {
      mount(`
        <div>Something else</div>
        <some-component ng-if="false"></some-component>
      `);

      expect(mockedComponent.exists()).toBe(false);
    });
  });

  describe('props', () => {
    it('returns props', () => {
      const props = { someProp: 'Some value', onSomePropChange: jest.fn() };
      mount(
        `
          <div>Something else</div>
          <some-component
            some-prop="someProp"
            on-some-prop-change="onSomePropChange()"
          ></some-component>
        `,
        props,
      );

      expect(mockedComponent.props()).toEqual({
        someProp: 'Some value',
        onSomePropChange: expect.any(Function), // due to Angular's handling of callbacks
      });
    });
  });

  describe('prop', () => {
    it('returns prop with key', () => {
      const props = { someProp: 'Some value', onSomePropChange: jest.fn() };
      mount(
        `
        <div>Something else</div>
        <some-component some-prop="someProp"></some-component>
        `,
        props,
      );

      expect(mockedComponent.prop('someProp')).toBe('Some value');
    });
  });

  describe('simulate', () => {
    it('invokes callback', () => {
      const onSomePropChange = jest.fn();
      const props = { onSomePropChange };
      mount(
        `
        <div>Something else</div>
        <some-component on-some-prop-change="onSomePropChange($event)"></some-component>
        `,
        props,
      );

      expect(onSomePropChange).not.toBeCalled();
      mockedComponent.simulate('somePropChange', 'New value');
      expect(onSomePropChange).toBeCalledWith('New value');
    });
  });

  function mount(template, props) {
    Object.assign($scope, props);

    let element;
    angular.mock.inject($compile => {
      element = $compile(template)($scope);
    });
    $scope.$digest();

    return element;
  }
});
