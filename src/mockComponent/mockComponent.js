import { compose, convertKebabCaseToCamelCase } from '../common/utils';

export default function mockComponent(kebabCaseName) {
  const name = convertKebabCaseToCamelCase(kebabCaseName);

  function mock($provide) {
    $provide.decorator(`${name}Directive`, $delegate => {
      const component = $delegate[0];

      component.controller = function controller() {
        mock._controller = this;
      };

      return $delegate;
    });
  }

  angular.mock.module(mock);

  return withMethods(mock);
}

function withMethods(mock) {
  return compose(
    withExists,
    withProps,
    withProp,
    withSimulate,
  )(mock);
}

function withExists(mock) {
  mock.exists = () => !!mock._controller;
  return mock;
}

function withProps(mock) {
  mock.props = () => {
    const { controller, ...props } = mock._controller;
    return props;
  };
  return mock;
}

function withProp(mock) {
  mock.prop = key => mock._controller[key];
  return mock;
}

function withSimulate(mock) {
  mock.simulate = event => {
    const callbackName = `on${event[0].toUpperCase()}${event.slice(1)}`;
    mock._controller[callbackName]();
  };
  return mock;
}
