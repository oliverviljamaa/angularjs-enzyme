import TestElementWrapper from './TestElementWrapper';
import mockComponent from '../mockComponent';

export default function mount(template, props = {}, { mockComponents = [] } = {}) {
  const mockedComponents = getMockedComponents(mockComponents);
  const angularElement = getAngularElement(template, props);

  return new TestElementWrapper(angularElement, mockedComponents);
}

function getAngularElement(template, props) {
  let $rootScope;
  let element;

  angular.mock.inject(($compile, $injector) => {
    $rootScope = $injector.get('$rootScope');
    $rootScope.$ctrl = props;

    element = $compile(template)($rootScope);
  });
  $rootScope.$digest();

  return element;
}

function getMockedComponents(names) {
  return names.reduce(
    (components, name) => ({
      ...components,
      [name]: mockComponent(name),
    }),
    {},
  );
}
