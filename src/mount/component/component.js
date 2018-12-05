import angular from 'angular';
import 'angular-mocks';

import { convertKebabCaseToCamelCase } from '../../common/utils';

export function getPropsDefinition(tag) {
  const name = getNameForInjector(tag);

  let propsDefinition;
  angular.mock.inject($injector => {
    propsDefinition = $injector.get(name)[0].bindToController;
  });
  return propsDefinition;
}

export function compile(template, props) {
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

function getNameForInjector(tag) {
  return `${convertKebabCaseToCamelCase(tag)}Directive`;
}
