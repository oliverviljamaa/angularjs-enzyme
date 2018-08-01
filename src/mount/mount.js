import TestElementWrapper from './TestElementWrapper';

export default function mount(template, props) {
  let $scope;
  let element;

  angular.mock.inject(($compile, $injector) => {
    $scope = $injector.get('$rootScope').$new();
    $scope.$ctrl = props;

    element = $compile(template)($scope);
  });
  $scope.$digest();

  return new TestElementWrapper(element);
}
