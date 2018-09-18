import 'angular';
import 'angular-mocks';

import mount from '.';
import TestElementWrapper from './TestElementWrapper';

jest.mock(
  './TestElementWrapper',
  () =>
    class {
      constructor(angularElement) {
        this.angularElementForSpec = angularElement;
      }
    },
);

describe('mount', () => {
  it('returns a test element wrapper created from angular element', () => {
    initAngularComponents({
      someComponent: {
        template: '<div>Some content</div>',
      },
    });

    const component = mount('<some-component></some-component>');

    expect(component).toBeInstanceOf(TestElementWrapper);
    expect(component.angularElementForSpec).toBeDefined();
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
});

function initAngularComponents(components) {
  const angularModule = angular.module('someModule', []);

  Object.keys(components).forEach(name => {
    angularModule.component(name, components[name]);
  });

  angular.mock.module('someModule');
}
