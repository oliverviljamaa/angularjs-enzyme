import 'angular';
import 'angular-mocks';

import { mockComponent, mount } from '../main';

describe('Mock component', () => {
  let mockedComponent;
  beforeEach(() => {
    angular.module('some-module', []).component('someComponent', {
      bindings: { someProp: '<', onSomePropChange: '&', onAnotherPropChange: '&' },
    });

    angular.mock.module('some-module');

    mockedComponent = mockComponent('some-component');
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
            some-prop="$ctrl.someProp"
            on-some-prop-change="$ctrl.onSomePropChange()"
          ></some-component>
        `,
        props,
      );

      expect(mockedComponent.props()).toEqual({
        someProp: 'Some value',
        onSomePropChange: expect.any(Function), // due to Angular's handling of callbacks
        onAnotherPropChange: expect.any(Function), // due to Angular's handling of callbacks
      });
    });
  });

  describe('prop', () => {
    it('returns prop with key', () => {
      const props = { someProp: 'Some value', onSomePropChange: jest.fn() };
      mount(
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
    let component;
    let onSomePropChange;
    beforeEach(() => {
      onSomePropChange = jest.fn();
      const props = { onSomePropChange };
      component = mount(
        `
        <main>
          <div ng-if="$ctrl.show">Something else</div>
          <some-component
            on-some-prop-change="$ctrl.onSomePropChange($event)"
            on-another-prop-change="$ctrl.show = true"
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

    it('updates view', () => {
      expect(component.find('div').exists()).toBe(false);
      mockedComponent.simulate('anotherPropChange');
      expect(component.find('div').exists()).toBe(true);
    });

    it('returns itself for chaining', () => {
      expect(mockedComponent.simulate('somePropChange', 'New value')).toBe(mockedComponent);
    });
  });

  it('has template of <!-- mock of {{ name }} -->', () => {
    const component = mount(`
      <main>
        <div>Something else</div>
        <some-component></some-component>
      </main>
    `);

    expect(component.find('some-component').html()).toBe('<!-- mock of some-component -->');
  });
});
