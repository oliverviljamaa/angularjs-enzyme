export default class TestElementWrapper {
  constructor(angularElement) {
    this.length = angularElement.length;

    this.html = () => angularElement.html();
    this.text = () => angularElement.text();
    this.hasClass = name => angularElement.hasClass(name);

    this.exists = () => angularElement && angularElement.length > 0;

    this.find = selector => {
      const foundElement = angularElement[0].querySelectorAll(selector);
      return elementToTestElementWrapper(foundElement);
    };

    this.map = fn => [...angularElement].map(elementToTestElementWrapper).map(fn);

    this.props = () =>
      [...angularElement[0].attributes].reduce(
        (props, { name, value }) => ({ ...props, [name]: value }),
        {},
      );

    this.prop = key => angularElement.attr(key);

    this.simulate = (event, data) => {
      if (event === 'change') {
        if (!data || !data.target) {
          throw new Error('Simulating change expects an event object ({ target: { value } })');
        }
        angularElement.val(data.target.value).triggerHandler('input');
        return this;
      }
      angularElement.triggerHandler(event);

      return this;
    };

    this.setProps = props => {
      let $rootScope;
      angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
      });

      $rootScope.$ctrl = {
        ...$rootScope.$ctrl,
        ...props,
      };

      $rootScope.$digest();

      return this;
    };
  }
}

function elementToTestElementWrapper(element) {
  return new TestElementWrapper(angular.element(element));
}
