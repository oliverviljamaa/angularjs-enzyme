import angular from 'angular';
import 'angular-mocks';

import { mockComponent } from '../main';

describe('Mock component', () => {
  let mockedComponent;
  beforeEach(() => {
    angular.module('some-module', []).component('someComponent', {
      bindings: { someProp: '<', onSomePropChange: '<' },
    });

    angular.mock.module('some-module');

    mockedComponent = mockComponent('some-component');
  });

  describe('exists', () => {
    it('is true when in mounted template', () => {
      compile(`
        <div>Something else</div>
        <some-component></some-component>
      `);

      expect(mockedComponent.exists()).toBe(true);
    });

    it('is false when not in template', () => {
      compile('<div>Something else</div>');

      expect(mockedComponent.exists()).toBe(false);
    });

    it('is false when not in mounted template', () => {
      compile(`
        <div>Something else</div>
        <some-component ng-if="false"></some-component>
      `);

      expect(mockedComponent.exists()).toBe(false);
    });
  });

  describe('props', () => {
    it('returns props', () => {
      const onSomePropChange = jest.fn();
      const props = { someProp: 'Some value', onSomePropChange };
      compile(
        `
          <div>Something else</div>
          <some-component
            some-prop="$ctrl.someProp"
            on-some-prop-change="$ctrl.onSomePropChange"
          ></some-component>
        `,
        props,
      );

      expect(mockedComponent.props()).toEqual({
        someProp: 'Some value',
        onSomePropChange,
      });
    });
  });

  describe('prop', () => {
    it('returns prop with key', () => {
      const props = { someProp: 'Some value', onSomePropChange: jest.fn() };
      compile(
        `
          <div>Something else</div>
          <some-component some-prop="$ctrl.someProp"></some-component>
        `,
        props,
      );

      expect(mockedComponent.prop('someProp')).toBe('Some value');
    });
  });

  describe('simulate', () => {
    let onSomePropChange;
    beforeEach(() => {
      onSomePropChange = jest.fn();
      const props = { onSomePropChange };
      compile(
        `
        <main>
          <div ng-if="$ctrl.show">Something else</div>
          <some-component
            on-some-prop-change="$ctrl.onSomePropChange"
          ></some-component>
        </main>
        `,
        props,
      );
    });

    it('invokes callback', () => {
      expect(onSomePropChange).not.toBeCalled();
      mockedComponent.simulate('somePropChange', 'New value');
      expect(onSomePropChange).toBeCalledWith('New value');
    });

    it('returns itself for chaining', () => {
      expect(mockedComponent.simulate('somePropChange', 'New value')).toBe(mockedComponent);
    });
  });

  it('has template of <!-- mock of {{ name }} -->', () => {
    const component = compile(`
      <main>
        <div>Something else</div>
        <some-component></some-component>
      </main>
    `);

    expect(component.find('some-component').html()).toBe('<!-- mock of some-component -->');
  });
});

function compile(template, props) {
  let $rootScope;
  let element;

  angular.mock.inject($injector => {
    $rootScope = $injector.get('$rootScope');
    $rootScope.$ctrl = props;

    const $compile = $injector.get('$compile');
    element = $compile(template)($rootScope);
  });
  $rootScope.$digest();

  return element;
}
