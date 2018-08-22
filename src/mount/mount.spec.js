import 'angular';
import 'angular-mocks';

import mount from '.';
import TestElementWrapper from './TestElementWrapper';
import mockComponent from '../mockComponent';

jest.mock('../mockComponent', () => jest.fn());
jest.mock(
  './TestElementWrapper',
  () =>
    class {
      constructor(angularElement, mockedComponents) {
        this.angularElementForSpec = angularElement;
        this.mockedComponentsForSpec = mockedComponents;
      }
    },
);

describe('mount', () => {
  it('returns a test element wrapper created from angular element and mocked components', () => {
    initAngularComponents({
      someComponent: {
        template: '<div>Some content</div>',
      },
    });

    const component = mount('<some-component></some-component>');

    expect(component).toBeInstanceOf(TestElementWrapper);
    expect(component.angularElementForSpec).toBeDefined();
    expect(component.mockedComponentsForSpec).toBeDefined();
  });

  it('makes props accessible through $ctrl', () => {
    initAngularComponents({
      someComponent: {
        bindings: { someProp: '<' },
        template: '<div>{{ $ctrl.someProp }}</div>',
      },
    });

    const { angularElementForSpec } = mount(
      '<some-component some-prop="$ctrl.someProp"></some-component>',
      { someProp: 'Prop value' },
    );

    expect(angularElementForSpec.text()).toBe('Prop value');
  });

  it('does not mock components by default', () => {
    initAngularComponents({
      childComponent: {
        template: '<span>Child component content</span>',
      },
      someComponent: {
        template: `
          <div>
            Some component content
            <child-component></child-component>
          </div>
        `,
      },
    });

    const { angularElementForSpec } = mount('<some-component></some-component>');

    const html = trimWhitespace(angularElementForSpec.find('child-component').html());

    expect(html).toBe('<span>Child component content</span>');
  });

  it('mocks components when so specified', () => {
    initAngularComponents({
      aChildComponent: {
        template: '<span>A child component content</span>',
      },
      anotherChildComponent: {
        template: '<span>Another child component content</span>',
      },
      someComponent: {
        template: `
          <div>
            Some component content
            <a-child-component></a-child-component>
            <another-child-component></another-child-component>
          </div>
        `,
      },
    });

    mockComponent.mockImplementation(name => `mock of ${name}`);

    expect(mockComponent).not.toBeCalled();

    const { mockedComponentsForSpec } = mount(
      '<some-component some-prop="$ctrl.someProp"></some-component>',
      { someProp: 'Prop value' },
      { mockComponents: ['a-child-component', 'another-child-component'] },
    );

    expect(mockComponent).toBeCalledWith('a-child-component');
    expect(mockComponent).toBeCalledWith('another-child-component');

    expect(mockedComponentsForSpec).toEqual({
      'a-child-component': 'mock of a-child-component',
      'another-child-component': 'mock of another-child-component',
    });
  });
});

function trimWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function initAngularComponents(components) {
  const angularModule = angular.module('someModule', []);

  Object.keys(components).forEach(name => {
    angularModule.component(name, components[name]);
  });

  angular.mock.module('someModule');
}
