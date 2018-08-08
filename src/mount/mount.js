import TestElementWrapper from './TestElementWrapper';

export default function mount(template, props) {
  let $rootScope;
  let element;

  angular.mock.inject(($compile, $injector) => {
    $rootScope = $injector.get('$rootScope');
    $rootScope.$ctrl = props;

    element = $compile(template)($rootScope);
  });
  $rootScope.$digest();

  return new TestElementWrapper(element);
}
